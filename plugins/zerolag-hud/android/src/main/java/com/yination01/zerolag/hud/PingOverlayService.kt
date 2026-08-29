package com.yination01.zerolag.hud

import android.app.ActivityManager
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.graphics.Color
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.WindowManager
import android.widget.TextView
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.net.InetSocketAddress
import java.net.Socket

/**
 * Floating game bar and notification readout. Passive: it never resets the
 * connection or changes VPN state during a live match. Every few seconds it
 * measures TCP connect RTT to an anycast edge and reads used-RAM percent,
 * then shows both on the overlay pill and in the ongoing notification so
 * the user always has analytics visible, in games and daily use.
 */
class PingOverlayService : Service() {

    private val scope = CoroutineScope(Dispatchers.Default + Job())
    private lateinit var windowManager: WindowManager
    private var barView: TextView? = null
    private lateinit var notificationManager: NotificationManager

    private val openIntent by lazy {
        PendingIntent.getActivity(
            this, 0, packageManager.getLaunchIntentForPackage(packageName),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
    }

    override fun onCreate() {
        super.onCreate()
        notificationManager = getSystemService(NotificationManager::class.java)
        createChannel()
        startAsForeground("-- ms", "--% RAM")
        addOverlay()
        startLoop()
    }

    private fun createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            notificationManager.createNotificationChannel(
                NotificationChannel(CHANNEL, "Zero-Lag game bar", NotificationManager.IMPORTANCE_LOW)
                    .apply { description = "Live ping and device performance over games." }
            )
        }
    }

    private fun notification(pingText: String, ramText: String): Notification {
        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            Notification.Builder(this, CHANNEL)
        else @Suppress("DEPRECATION") Notification.Builder(this)
        return builder
            .setContentTitle("Zero-Lag")
            .setContentText("Ping $pingText   |   RAM $ramText")
            .setSmallIcon(android.R.drawable.stat_sys_data_bluetooth)
            .setContentIntent(openIntent)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .build()
    }

    private fun startAsForeground(pingText: String, ramText: String) {
        val notif = notification(pingText, ramText)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(NOTIF_ID, notif, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
        } else {
            startForeground(NOTIF_ID, notif)
        }
    }

    private fun addOverlay() {
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        val view = TextView(this).apply {
            text = "Zero-Lag\n-- ms  --% RAM"
            textSize = 12f
            setTextColor(Color.parseColor("#00FF88"))
            setBackgroundColor(Color.parseColor("#CC0A0F14"))
            setPadding(28, 16, 28, 16)
        }
        val type = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        else @Suppress("DEPRECATION") WindowManager.LayoutParams.TYPE_PHONE
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            type,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT
        ).apply { gravity = Gravity.TOP or Gravity.START; x = 24; y = 96 }
        runCatching { windowManager.addView(view, params); barView = view }
    }

    private fun startLoop() {
        scope.launch {
            while (isActive) {
                val rtt = tcpRtt("1.1.1.1", 443)
                val ramPct = usedRamPercent()
                withContext(Dispatchers.Main) {
                    val pingText = if (rtt != null) "$rtt ms" else "LOST"
                    val ramText = "$ramPct% RAM"
                    val pingColor = when {
                        rtt == null -> Color.parseColor("#FF4D4D")
                        rtt < 60 -> Color.parseColor("#00FF88")
                        rtt < 100 -> Color.parseColor("#FFC107")
                        else -> Color.parseColor("#FF4D4D")
                    }
                    barView?.let { v ->
                        v.text = "Zero-Lag\n$pingText   $ramText"
                        v.setTextColor(pingColor)
                    }
                    runCatching { notificationManager.notify(NOTIF_ID, notification(pingText, ramText)) }
                }
                delay(2000)
            }
        }
    }

    private fun usedRamPercent(): Int {
        val am = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val info = ActivityManager.MemoryInfo()
        am.getMemoryInfo(info)
        if (info.totalMem <= 0) return 0
        val used = info.totalMem - info.availMem
        return ((used * 100) / info.totalMem).toInt().coerceIn(0, 100)
    }

    private fun tcpRtt(host: String, port: Int): Long? {
        var s: Socket? = null
        return try {
            s = Socket()
            val start = System.nanoTime()
            s.connect(InetSocketAddress(host, port), 2000)
            (System.nanoTime() - start) / 1_000_000
        } catch (e: Exception) {
            null
        } finally {
            runCatching { s?.close() }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        barView?.let { runCatching { windowManager.removeView(it) } }
        barView = null
    }

    override fun onBind(intent: Intent?): IBinder? = null

    companion object {
        private const val CHANNEL = "zerolag_hud"
        private const val NOTIF_ID = 4711

        fun start(ctx: Context) {
            val i = Intent(ctx, PingOverlayService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) ctx.startForegroundService(i)
            else ctx.startService(i)
        }
        fun stop(ctx: Context) = ctx.stopService(Intent(ctx, PingOverlayService::class.java))
    }
}
