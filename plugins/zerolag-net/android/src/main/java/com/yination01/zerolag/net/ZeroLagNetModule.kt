package com.yination01.zerolag.net

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import android.telephony.CellInfo
import android.telephony.CellInfoCdma
import android.telephony.CellInfoGsm
import android.telephony.CellInfoLte
import android.telephony.CellInfoWcdma
import android.telephony.TelephonyManager
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Native telephony reader: carrier, network tech and RSRP/RSSI dBm.
 * Requires ACCESS_FINE_LOCATION (Android requirement for cell info) and
 * READ_PHONE_STATE. Returns null fields rather than throwing when denied.
 */
class ZeroLagNetModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

    private val appContext: Context = context.applicationContext

    override fun getName(): String = "ZeroLagNet"

    // Foreground app for game detection. Requires Usage Access (a special
    // settings permission, not a runtime grant). Returns "PERMISSION_DENIED"
    // so JS shows the grant screen instead of fabricating a game.
    @ReactMethod
    fun getForegroundPackage(promise: Promise) {
        try {
            if (!hasUsageAccess()) {
                promise.resolve("PERMISSION_DENIED")
                return
            }
            val usm = appContext.getSystemService(Context.USAGE_STATS_SERVICE)
                as android.app.usage.UsageStatsManager
            val now = System.currentTimeMillis()
            val events = usm.queryEvents(now - 10_000, now)
            var lastPkg: String? = null
            val e = android.app.usage.UsageEvents()
            while (events.hasNextEvent()) {
                events.getNextEvent(e)
                if (e.eventType == android.app.usage.UsageEvents.Event.ACTIVITY_RESUMED ||
                    e.eventType == android.app.usage.UsageEvents.Event.MOVE_TO_FOREGROUND
                ) {
                    lastPkg = e.packageName
                }
            }
            promise.resolve(lastPkg ?: "PERMISSION_DENIED")
        } catch (ex: Exception) {
            promise.resolve("PERMISSION_DENIED")
        }
    }

    private fun hasUsageAccess(): Boolean {
        return try {
            val appOps = appContext.getSystemService(Context.APP_OPS_SERVICE)
                as android.app.AppOpsManager
            val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                appOps.unsafeCheckOpNoThrow(
                    android.app.AppOpsManager.OPSTR_GET_USAGE_STATS,
                    android.os.Process.myUid(),
                    appContext.packageName
                )
            } else {
                @Suppress("DEPRECATION")
                appOps.checkOpNoThrow(
                    android.app.AppOpsManager.OPSTR_GET_USAGE_STATS,
                    android.os.Process.myUid(),
                    appContext.packageName
                )
            }
            mode == android.app.AppOpsManager.MODE_ALLOWED
        } catch (e: Exception) {
            false
        }
    }

    @ReactMethod
    fun getSnapshot(promise: Promise) {
        try {
            val telephony = appContext.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
            val connectivity = appContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

            val hasLocation = ContextCompat.checkSelfPermission(
                appContext, Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED

            val caps = connectivity.activeNetwork?.let { connectivity.getNetworkCapabilities(it) }
            val isWifi = caps?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) == true

            val map = Arguments.createMap()
            map.putBoolean("isWifi", isWifi)

            if (hasLocation) {
                runCatching { map.putString("carrier", telephony.networkOperatorName ?: "Unknown") }
            } else {
                map.putString("carrier", "Unknown")
            }

            if (isWifi) {
                map.putString("networkType", "Wi-Fi")
                map.putNull("dbm")
                map.putString("quality", "Wi-Fi connection")
            } else {
                map.putString("networkType", networkType(telephony, caps))
                val dbm = if (hasLocation) readDbm(telephony) else null
                if (dbm != null) {
                    map.putInt("dbm", dbm)
                    map.putString("quality", qualityLabel(dbm))
                } else {
                    map.putNull("dbm")
                    map.putString("quality", "Signal detail unavailable")
                }
            }
            promise.resolve(map)
        } catch (e: Exception) {
            promise.resolve(null)
        }
    }

    private fun networkType(tm: TelephonyManager, caps: NetworkCapabilities?): String {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) return "Cellular"
        if (caps?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) != true) return "Unknown"
        return runCatching {
            when (tm.dataNetworkType) {
                TelephonyManager.NETWORK_TYPE_NR -> "5G"
                TelephonyManager.NETWORK_TYPE_LTE -> "4G LTE"
                TelephonyManager.NETWORK_TYPE_HSPAP,
                TelephonyManager.NETWORK_TYPE_HSPA,
                TelephonyManager.NETWORK_TYPE_UMTS -> "3G"
                TelephonyManager.NETWORK_TYPE_EDGE,
                TelephonyManager.NETWORK_TYPE_GPRS -> "2G"
                else -> "Cellular"
            }
        }.getOrDefault("Cellular")
    }

    private fun readDbm(tm: TelephonyManager): Int? {
        val cells: List<CellInfo> = runCatching { tm.allCellInfo }.getOrNull() ?: return null
        val reg = cells.firstOrNull { it.isRegistered } ?: return null
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && reg is android.telephony.CellInfoNr) {
            return reg.cellSignalStrength.dbm.takeIf { it > -200 }
        }
        return when (reg) {
            is CellInfoLte -> reg.cellSignalStrength.rsrp.takeIf { it > -200 }
            is CellInfoWcdma -> reg.cellSignalStrength.dbm.takeIf { it > -200 }
            is CellInfoGsm -> reg.cellSignalStrength.dbm.takeIf { it > -200 }
            is CellInfoCdma -> reg.cellSignalStrength.dbm.takeIf { it > -200 }
            else -> null
        }
    }

    private fun qualityLabel(dbm: Int): String = when {
        dbm >= -80 -> "excellent"
        dbm >= -95 -> "good"
        dbm >= -110 -> "fair"
        dbm >= -120 -> "weak"
        else -> "very weak"
    }
}
