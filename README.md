# Mimi Puerto

A Minecraft Bedrock addon that provides teleportation functionality to claimed lands.

## Features

- Teleport to the center of any claimed land
- Sort lands by name or owner
- Dimension-specific land listing
- Case-insensitive alphabetical sorting
- Safe landing with maximum height teleport

## How to Get

1. Name a diamond "Give Mimi Puerto"
2. Use the diamond to receive the Mimi Puerto item
3. The item will be locked to inventory and kept on death

## Usage

1. Hold the Mimi Puerto item
2. Use the item to open the teleport menu
3. Choose sorting preference:
   - By Land Names: Alphabetically sorted claims
   - By Owners: Claims grouped under owner names
4. Select destination to teleport

## Technical Details

- Teleports to calculated center point of claimed areas
- Only shows lands in current dimension
- Maintains original claim Y-level data
- Uses Minecraft Bedrock scripting API
- Supports custom UI with formatted text

## Dependencies

- Minecraft Bedrock 1.20+
- Claims system integration
