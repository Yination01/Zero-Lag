package com.yination01.zerolag.device

import android.app.ActivityManager
import android.content.Context
import android.os.Build
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File

/**
 * Exposes device facts used by the performance-tier engine: model, total
 * RAM and CPU cores. These are read-only and need no dangerous permission.
 */
class ZeroLagDeviceModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

    private val appContext: Context = context.applicationContext

    override fun getName(): String = "ZeroLagDevice"

    @ReactMethod
    fun getFacts(promise: Promise) {
        try {
            val map = Arguments.createMap()
            map.putString("model", "${Build.MANUFACTURER} ${Build.MODEL}")
            map.putInt("cores", Runtime.getRuntime().availableProcessors())
            map.putDouble("ramMb", totalRamMb().toDouble())
            promise.resolve(map)
        } catch (e: Exception) {
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun getCoreCount(promise: Promise) {
        promise.resolve(Runtime.getRuntime().availableProcessors())
    }

    private fun totalRamMb(): Long {
        val actManager = appContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val memInfo = ActivityManager.MemoryInfo()
        actManager.getMemoryInfo(memInfo)
        return memInfo.totalMem / (1024 * 1024)
    }
}
