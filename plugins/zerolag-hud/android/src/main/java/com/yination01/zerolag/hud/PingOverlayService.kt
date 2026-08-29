package com.yination01.zerolag.hud

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
 * Floating, read-only ping meter over games. Passive: it never resets the
 * connection or changes VPN state during a live match. Measures TCP connect
 * RTT to an anycast edge every 2 seconds. Requires the overlay permission.
 */
class PingOverlayService : Service() {

    private val scope = CoroutineScope(Dispatchers.Default + Job())
    private lateinit var windowManager: WindowManager
    private var pingView: TextView? = null

    override fun onCreate() {
        super.onCreate()
        startAsForeground()
        addOverlay()
        startLoop()
    }

    private fun startAsForeground() {
        val channelId = "zerolag_hud"
        val nm = getSystemService(NotificationManager::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            nm.createNotificationChannel(
                NotificationChannel(channelId, "Ping HUD", NotificationManager.IMPORTANCE_LOW)
                    .apply { description = "Floating real-time ping meter over games." }
            )
        }
        val open = PendingIntent.getActivity(
            this, 0, packageManager.getLaunchIntentForPackage(packageName),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        val notif: Notification =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Notification.Builder(this, channelId)
                    .setContentTitle("Zero-Lag ping HUD is running")
                    .setContentText("Monitoring network stability.")
                    .setSmallIcon(android.R.drawable.stat_sys_data_bluetooth)
                    .setContentIntent(open).setOngoing(true).build()
            } else {
                @Suppress("DEPRECATION")
                Notification.Builder(this)
                    .setContentTitle("Zero-Lag ping HUD")
                    .setContentText("Monitoring network stability")
                    .setSmallIcon(android.R.drawable.stat_sys_data_bluetooth)
                    .setContentIntent(open).setOngoing(true).build()
            }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(4711, notif, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
        } else {
            startForeground(4711, notif)
        }
    }

    private fun addOverlay() {
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        val view = TextView(this).apply {
            text = "-- ms"
            textSize = 13f
            setTextColor(Color.parseColor("#00FF88"))
            setBackgroundColor(Color.parseColor("#B3000000"))
            setPadding(24, 12, 24, 12)
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
        ).apply { gravity = Gravity.TOP or Gravity.END; x = 24; y = 96 }
        runCatching { windowManager.addView(view, params); pingView = view }
    }

    private fun startLoop() {
        scope.launch {
            while (isActive) {
                val rtt = tcpRtt("1.1.1.1", 443)
                withContext(Dispatchers.Main) {
                    val v = pingView ?: return@withContext
                    v.text = if (rtt != null) "$rtt ms" else "LOST"
                    v.setTextColor(
                        when {
                            rtt == null -> Color.parseColor("#FF4D4D")
                            rtt < 60 -> Color.parseColor("#00FF88")
                            rtt < 100 -> Color.parseColor("#FFC107")
                            else -> Color.parseColor("#FF4D4D")
                        }
                    )
                }
                delay(2000)
            }
        }
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
        pingView?.let { runCatching { windowManager.removeView(it) } }
        pingView = null
    }

    override fun onBind(intent: Intent?): IBinder? = null

    companion object {
        fun start(ctx: Context) {
            val i = Intent(ctx, PingOverlayService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) ctx.startForegroundService(i)
            else ctx.startService(i)
        }
        fun stop(ctx: Context) = ctx.stopService(Intent(ctx, PingOverlayService::class.java))
    }
}
