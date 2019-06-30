#!/usr/bin/env bash
# If the directory, `dist`, doesn't exist, create `dist`
stat dist || mkdir dist
# Archive artifacts
zip -r absencebot.zip dist package.json
