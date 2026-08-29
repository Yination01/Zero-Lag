package com.zerolag.app.hud

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
import com.zerolag.app.MainActivity
import com.zerolag.app.R
import com.zerolag.app.net.PingProbe
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * Floating, read-only ping meter shown over games.
 *
 * Passive by design: it NEVER resets the connection or changes VPN state —
 * that would forfeit a live match. It just measures RTT every 2 seconds and
 * color-codes the result.
 */
class PingOverlayService : Service() {

    private val scope = CoroutineScope(Dispatchers.Default + Job())
    private lateinit var windowManager: WindowManager
    private var pingView: TextView? = null

    override fun onCreate() {
        super.onCreate()
        startAsForeground()
        addOverlayView()
        startPingLoop()
    }

    private fun startAsForeground() {
        val channelId = "zerolag_hud"
        val nm = getSystemService(NotificationManager::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            nm.createNotificationChannel(
                NotificationChannel(
                    channelId,
                    getString(R.string.hud_channel_name),
                    NotificationManager.IMPORTANCE_LOW
                ).apply { description = getString(R.string.hud_channel_desc) }
            )
        }

        val openIntent = PendingIntent.getActivity(
            this, 0, Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val notification: Notification =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Notification.Builder(this, channelId)
                    .setContentTitle(getString(R.string.hud_notification_title))
                    .setContentText(getString(R.string.hud_notification_text))
                    .setSmallIcon(android.R.drawable.stat_sys_data_bluetooth)
                    .setContentIntent(openIntent)
                    .setOngoing(true)
                    .build()
            } else {
                @Suppress("DEPRECATION")
                Notification.Builder(this)
                    .setContentTitle("ZeroLag ping HUD")
                    .setContentText("Monitoring network stability")
                    .setSmallIcon(android.R.drawable.stat_sys_data_bluetooth)
                    .setContentIntent(openIntent)
                    .setOngoing(true)
                    .build()
            }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(
                NOTIF_ID, notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
            )
        } else {
            startForeground(NOTIF_ID, notification)
        }
    }

    private fun addOverlayView() {
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
        else
            @Suppress("DEPRECATION") WindowManager.LayoutParams.TYPE_PHONE

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            type,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.END
            x = 24
            y = 96
        }

        runCatching {
            windowManager.addView(view, params)
            pingView = view
        }
        // If overlay permission was revoked, addView throws; the service
        // still runs as a foreground notification so nothing crashes.
    }

    private fun startPingLoop() {
        scope.launch {
            while (isActive) {
                val sample = PingProbe.probeOnce()
                withContext(Dispatchers.Main) {
                    val view = pingView ?: return@withContext
                    val rtt = sample.rttMs
                    view.text = if (rtt != null) "$rtt ms" else "LOST"
                    view.setTextColor(
                        when {
                            rtt == null -> Color.parseColor("#FF4D4D")
                            rtt < 60 -> Color.parseColor("#00FF88")
                            rtt < 100 -> Color.parseColor("#FFC107")
                            else -> Color.parseColor("#FF4D4D")
                        }
                    )
                }
                delay(2000) // 2s cadence keeps battery impact minimal
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        pingView?.let { runCatching { windowManager.removeView(it) } }
        pingView = null
    }

    override fun onBind(intent: Intent?): IBinder? = null

    companion object {
        private const val NOTIF_ID = 4711

        fun start(context: Context) {
            val intent = Intent(context, PingOverlayService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
        }

        fun stop(context: Context) {
            context.stopService(Intent(context, PingOverlayService::class.java))
        }
    }
}
