@echo Reducing file size of  %1
@echo .
@pngcrush.exe -brute %1 _%1
