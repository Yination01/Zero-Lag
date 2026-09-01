package com.yination01.zerolag.hud

import android.content.Intent
import android.net.Uri
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Starts/stops the floating ping HUD service. Caller must first obtain the
 * "display over other apps" (overlay) permission; canDrawOverlays is
 * checked here and the JS layer is told via a rejected promise.
 */
class ZeroLagHudModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

    override fun getName(): String = "ZeroLagHud"

    @ReactMethod
    fun canDrawOverlays(promise: Promise) {
        promise.resolve(Settings.canDrawOverlays(context))
    }

    @ReactMethod
    fun openOverlaySettings(promise: Promise) {
        try {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:${context.packageName}")
            ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("OVERLAY_SETTINGS_FAILED", "Could not open Display over other apps settings", e)
        }
    }

    @ReactMethod
    fun isRunning(promise: Promise) {
        promise.resolve(PingOverlayService.isRunning())
    }

    @ReactMethod
    fun start(intervalMs: Double, promise: Promise) {
        try {
            if (!Settings.canDrawOverlays(context)) {
                promise.reject("OVERLAY_DENIED", "Display over other apps is not enabled")
                return
            }
            PingOverlayService.start(context, intervalMs.toLong())
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("HUD_START_FAILED", e.message)
        }
    }

    @ReactMethod
    fun stop(promise: Promise) {
        try {
            PingOverlayService.stop(context)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("HUD_STOP_FAILED", e.message)
        }
    }
}
