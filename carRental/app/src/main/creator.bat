@echo off
:: 💖 Nidavellir Touch: Android Resource Folder Creator
:: This batch file creates the full res/ directory structure with subfolders and files.

echo Creating Android resource folder structure...
echo.

:: Create folders
mkdir res
mkdir res\layout
mkdir res\drawable
mkdir res\values
mkdir res\xml

:: Create layout files
echo.> res\layout\activity_main.xml
echo.> res\layout\activity_login.xml
echo.> res\layout\activity_register.xml
echo.> res\layout\activity_car_list.xml
echo.> res\layout\activity_car_details.xml
echo.> res\layout\activity_booking_list.xml
echo.> res\layout\activity_profile.xml
echo.> res\layout\item_car.xml
echo.> res\layout\item_booking.xml

:: Create drawable files
echo.> res\drawable\ic_back.xml
echo.> res\drawable\ic_car_placeholder.xml
echo.> res\drawable\ic_home.xml
echo.> res\drawable\ic_bookings.xml
echo.> res\drawable\ic_profile.xml

:: Create values files
echo.> res\values\colors.xml
echo.> res\values\strings.xml
echo.> res\values\themes.xml

:: Create xml files
echo.> res\xml\backup_rules.xml
echo.> res\xml\data_extraction_rules.xml

echo.
echo All folders and files created successfully, sweetheart 💞
pause
