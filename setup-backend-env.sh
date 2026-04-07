#!/bin/bash

# Backend Environment Variables Setup Script
# Generated from Vly for Git Sync
# Run this script to set up your Convex backend environment variables

echo 'Setting up Convex backend environment variables...'

# Check if Convex CLI is installed
if ! command -v npx &> /dev/null; then
    echo 'Error: npx is not installed. Please install Node.js and npm first.'
    exit 1
fi

echo "Setting JWKS..."
npx convex env set "JWKS" -- "{\"keys\":[{\"use\":\"sig\",\"kty\":\"RSA\",\"n\":\"z9Cqi-e7dutmC0BaTEZ5lM5jatWmnvwUXrVdODSGf8fHPE9_FfVwcvzmVfc9ZMvdfPJtZVJ0KKgV2V-_30W9kXLJ72n7NYoBHYFoC0gD7kyZjoXyS4vJmoc6WmkMfPSPIs8brdBpQEp6x-SIRbVmNlmN2RB7Z9usUcG8GZDsbcZadzy3tjunLhxCdQicHj0_3Cb3AwQRqJ5X49ne-bzH7u980BjvIjlhlU8pxN2cpRrRqe05HWl1Qpi5WcQ_WqmHVDUZsWLTx-aHWF9GB83TcdoDMEQ3wxd3-sxLY1D0M3KlYsnZG-7on8lZcd0VX3oarHi80RvTr_u5hv1TOx88KQ\",\"e\":\"AQAB\"}]}"

echo "Setting JWT_PRIVATE_KEY..."
npx convex env set "JWT_PRIVATE_KEY" -- "-----BEGIN PRIVATE KEY----- MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDP0KqL57t262YL QFpMRnmUzmNq1aae/BRetV04NIZ/x8c8T38V9XBy/OZV9z1ky9188m1lUnQoqBXZ X7/fRb2Rcsnvafs1igEdgWgLSAPuTJmOhfJLi8mahzpaaQx89I8izxut0GlASnrH 5IhFtWY2WY3ZEHtn26xRwbwZkOxtxlp3PLe2O6cuHEJ1CJwePT/cJvcDBBGonlfj 2d75vMfu73zQGO8iOWGVTynE3ZylGtGp7TkdaXVCmLlZxD9aqYdUNRmxYtPH5odY X0YHzdNx2gMwRDfDF3f6zEtjUPQzcqViydkb7uifyVlx3RVfehqseLzRG9Ov+7mG /VM7HzwpAgMBAAECggEAA5laise9oGadQs6fgbiqvGACqsP+ebxl4eoELkgCmE3u bmX2DnxMsUEeABkjEA7TzCkqqdmOt3GJx1T4Lra3fMBfLO1J83hrYoZuNdvObZ8X /bbmJlbKbAmxggVVuQhHPlQV56G3YOypSbL0hTiKB6DvavX1HSxZxKS1TEANSC1i QD0y0DJhN7S6ynOBTt1EMfk4d9FYqc2UMfODslu8NnIs3R+9eBc9mrL3BSlFwgZx LO5TpIFD0548Za2Og5aMG25k/jpCY5seTUrA5F6jIujOVaQTxf27o3i9aQLqh4mF WI6yqo//wH6nY/dQahudgL9ia/Z/rKMNpkcuozrBbQKBgQDqGU85DZyhWumWLtWM 5zYoXvGBPmRxyTq+yCYM6mBjAPMbFhkQ1GY+TivPNgrBIZ72WJGph8XCpiTbk9Xd wNbzUg237DSy8yPLu/STToBxnuQUInTkv9m5DHHfu8O5XsKG+fAMy7ctjhD9H9Xn 55qgvS/uaY8aZyn7Tz2Agt4jXwKBgQDjQduqGc3YBNS7WGb9ieaZWieaErS3v05l kCbuSFPriuGyZ/0HKrROXyTFNwS47+2264ViSWyWq1Mocyob34D/YBhmXdIwpmiI i0MvbPJe/oFE41A+7FirfNDcfGXcrIdSCwMF/t6ROyFEf24rHhjanTWYpSSZ5v3i 6GS4PMoVdwKBgQDnmEpsIy9F4m8dCRBz6XoGzocWWed9OptHizM5q9XXnGTl8yKx J7BPC38D7G8PSne9NzpEAfJ/82abZNI8JD+DUTYJM0GfmDNdp4D7Crq/rXXvBXen prV7APjXYybrCPhiGHqH7jI2e0oLYad5WgP76a61qvDMKiu6WFZ8APxK+QKBgQDE dv4BWxeChgKnB/DZhWsu7irIXx2OsLuEwA939l1ehw1BX/b2SCviiQxP1pWlj/6R IaGJa/KNewWENbOUry9lF11gugFpf6NlUAfAK06JYzq8JEwOaeLqNhiWVJD3Ksw9 2Dk/6KvfICBNiGDks7tG25wnH7W5u2GH1eKlCCCoVwKBgH+r4HwVxbJmeTpns0zr KaIVnEn/wffhb3eTT5AcC7iLuTVVn0CDJCs9+oZvxwgYipXM5qwFgWUfQNMQ7ZqS 9SdwJspF3+RQW0bQ7d6CI0Zexx7afNL+3XLkEQ0Cj8GI2oY4HRE7ohZNOiTBnIN2 4L/nwrbDtdYK+9tdYvU6QYX7 -----END PRIVATE KEY-----"

echo "Setting SITE_URL..."
npx convex env set "SITE_URL" -- "http://localhost:5173"

echo "Setting VLY_APP_NAME..."
npx convex env set "VLY_APP_NAME" -- "ShubhMilan"

echo "✅ All backend environment variables have been set!"
echo "You can now run: pnpm dev:backend"
