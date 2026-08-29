package com.yination01.zerolag.hud

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
    fun overlaySettingsUrl(promise: Promise) {
        promise.resolve("package:" + context.packageName)
    }

    @ReactMethod
    fun start(promise: Promise) {
        try {
            if (!Settings.canDrawOverlays(context)) {
                promise.reject("OVERLAY_DENIED", "Overlay permission not granted")
                return
            }
            PingOverlayService.start(context)
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
