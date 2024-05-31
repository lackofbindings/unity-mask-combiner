# Unity Mask Combiner

Did you know must Unity files are just easily-editable plaintext?
If you open a Unity Avatar Mask in a text editor you can modify it manually.
This Project simplifies that process.

Note: Tested in and designed for Unity 2019, for use with VRChat.

You can access the tool here: https://lackofbindings.github.io/unity-mask-combiner/

## Instructions
Say you have an Avatar Mask in Unity already set up, but now you've made some changes to your armature, and theres no way to update the mask in Unity without re-importing the avatar to the mask and re-checking all those boxes from scratch.
1. Create a new mask and import the new armature, this will be the **Source mask** (you can optionally check any bones here and that will be merged as well)
2. **Save**! This is important, Unity does not write out to asset files until you save!
3. Drag the **Source mask** file into the `Source` slot (top) of this tool.
4. Find the original mask in file explorer, this will be the **Destination mask**.
5. Drag the **Destination mask** file into the `Destination` slot (bottom) of this tool.
6. Click the `Combine` button and the transform masks will be *additively* merged into the `Destination` slot.
7. Open the **Destination mask** file in a text editor. 
8. You can now copy the contents of the `Destination` slot, and paste it into the **Destination** mask file in the text editor.
9. Save the text editor, and if you have Unity auto-refresh off, right-click the Unity asset browser and click `Refresh`.

The **Destination mask** should now contain the combined paths of both masks, and items should be checked where they were checked in either mask (*additive*).

-----

Works well with [austintaylorx's MakeAvatarMask](https://forum.unity.com/threads/how-to-create-an-avatar-mask-for-custom-gameobject-hierarchy-from-scene.574270/#post-4398478)