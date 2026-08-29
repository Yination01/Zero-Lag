package com.zerolag.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val ZeroLagColors = darkColorScheme(
    primary = NeonGreen,
    onPrimary = Background,
    secondary = Blue,
    background = Background,
    onBackground = OnSurface,
    surface = Surface,
    onSurface = OnSurface,
    surfaceVariant = SurfaceVariant,
    onSurfaceVariant = OnSurfaceMuted,
    error = Red,
)

@Composable
fun ZeroLagTheme(content: @Composable () -> Unit) {
    // ZeroLag is always dark — it's a gamer utility.
    @Suppress("UNUSED_EXPRESSION") isSystemInDarkTheme()
    MaterialTheme(
        colorScheme = ZeroLagColors,
        typography = ZeroLagTypography,
        content = content
    )
}
