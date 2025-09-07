#!/bin/bash

set -e

PBXPROJ="ios/Instamobile.xcodeproj/project.pbxproj"

echo "🔧 Patching $PBXPROJ to remove '-G' flag for BoringSSL-GRPC..."

if [ -f "$PBXPROJ" ]; then
  sed -i.bak '/BoringSSL-GRPC/,/};/s/-G//' "$PBXPROJ"
  echo "✅ Successfully removed '-G' flag."
else
  echo "❌ File not found: $PBXPROJ"
  exit 1
fi