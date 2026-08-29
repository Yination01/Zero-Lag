package com.zerolag.app.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val ZeroLagTypography = Typography(
    headlineLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 34.sp,
        color = NeonGreen
    ),
    titleLarge = TextStyle(
        fontWeight = FontWeight.Bold,
        fontSize = 20.sp,
        color = OnSurface
    ),
    bodyLarge = TextStyle(
        fontSize = 16.sp,
        color = OnSurface
    ),
    bodyMedium = TextStyle(
        fontSize = 14.sp,
        color = OnSurfaceMuted
    ),
    labelLarge = TextStyle(
        fontWeight = FontWeight.SemiBold,
        fontSize = 14.sp,
        color = OnSurface
    ),
)
