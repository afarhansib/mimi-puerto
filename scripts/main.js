console.log("Mimi Puerto loaded.")

import { EntityInventoryComponent, ItemLockMode, ItemStack, ItemTypes, system, world } from '@minecraft/server'
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui"
import { lands } from './claims';

world.beforeEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (itemStack?.typeId === "minecraft:diamond" && itemStack?.nameTag === "Give Mimi Puerto") {
        const inventory = source.getComponent(EntityInventoryComponent.componentId)
        const puertoItem = new ItemStack(ItemTypes.get("mimi:puerto"), 1)

        system.run(() => {
            puertoItem.setLore(["Use this item to teleport to Any claimed area."])
            puertoItem.keepOnDeath = true
            puertoItem.lockMode = ItemLockMode.inventory
            inventory.container.addItem(puertoItem)
        })
    } else if (itemStack?.typeId === "mimi:puerto") {
        // source.sendMessage("yep workin.")
        system.run(() => openMenu(source))
    }
})

function openMenu(player) {
    const sortMenu = new ActionFormData()
    sortMenu.title("§lMimi Puerto§r Sort Menu")
    sortMenu.body("\nSelect how to view the lands:\n\n")
    sortMenu.button("By Land Names", "textures/ui/worldsIcon.png")
    sortMenu.button("By Owners", "textures/ui/icon_multiplayer.png")

    sortMenu.show(player).then(({ canceled, selection }) => {
        if (canceled) return
        if (selection === 0) showLandsList(player, 'name')
        if (selection === 1) showLandsList(player, 'owner')
    })
}

function showLandsList(player, sortType) {
    const landsMenu = new ActionFormData()
    landsMenu.title("§lMimi Puerto§r Lands")

    let sortedLands = [...lands].filter(land => land.dimension === player.dimension.id)
    let buttonOptions = []

    if (sortType === 'name') {
        sortedLands.sort((a, b) => a.id.toLowerCase().localeCompare(b.id.toLowerCase()))
        buttonOptions = sortedLands.map(land => [
            `§l${land.id}§r\n§o§5${land.owner}`,
            "textures/ui/icon_recipe_nature.png",
            () => teleport(player, getCenterCoords(land))
        ])
        buttonOptions.forEach(([text, icon]) => {
            landsMenu.button(text, icon)
        })
    } else {
        // Group by owner
        const landsByOwner = {}
        sortedLands.forEach(land => {
            if (!landsByOwner[land.owner]) {
                landsByOwner[land.owner] = []
            }
            landsByOwner[land.owner].push(land)
        })

        // Sort owners alphabetically
        const sortedOwners = Object.keys(landsByOwner).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

        buttonOptions = []
        sortedOwners.forEach(owner => {
            landsByOwner[owner].forEach(land => {
                buttonOptions.push([
                    `§l${owner}§r§o§5\n${land.id}`,
                    "textures/ui/icon_recipe_nature.png",
                    () => teleport(player, getCenterCoords(land))
                ])
            })
        })

        buttonOptions.forEach(([text, icon]) => {
            landsMenu.button(text, icon)
        })
    }

    landsMenu.show(player).then(({ canceled, selection }) => {
        if (canceled) return
        const selectedOption = buttonOptions[selection]
        if (selectedOption && typeof selectedOption[2] === "function") {
            selectedOption[2]()
        }
    })
}

function teleport(player, coords) {
    world.getDimension("overworld").runCommand(`tp ${player.name} ${coords.x} ${coords.y} ${coords.z}`)
}

function getCenterCoords(land) {
    return {
        x: Math.floor((land.from.x + land.to.x) / 2),
        y: land.originalcr.y, // Keep original Y level for safe landing
        z: Math.floor((land.from.z + land.to.z) / 2)
    }
}