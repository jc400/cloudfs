export const BACKEND_URL = "http://localhost:8000/api";

export const template = {
    "metadata": "",
    "files": {
        "home": {
            "parent": null,
            "file_type": "d",
            "title": "home",
            "content": null,
            "created": null,
            "updated": null,
            "starred": false,
            "tags": []
        }
    }
}
export const demoTemplate = {
    "metadata": "",
    "files": {
        "a": {
            "parent": null,
            "file_type": "d",
            "title": "Example Directory",
            "content": null,
            "created": null,
            "updated": null,
            "starred": false,
            "tags": []
        },
        "b": {
            "parent": null,
            "file_type": "f",
            "title": "Introduction",
            "content": "Welcome.\n\nThis is a simple note-taking application; the design is inspired by VSCode. \n\nUse the sidebar to open the Notes or the Search panel, then double-click a file to open it in the editor. \n\nEdit, delete, and create notes by right-clicking, or by using keyboard shortcuts: ctrl + x|c|v|d|r.\n\nDouble click a tag to see other notes with that same tag.",
            "created": null,
            "updated": null,
            "starred": false,
            "tags": ["demo", "tag A", "tag B"]
        },
        "c": {
            "parent": "a",
            "file_type": "f",
            "title": "Example Note",
            "content": "This is an example note.",
            "created": null,
            "updated": null,
            "starred": false,
            "tags": ["demo", "tag A"]
        }
    }
}

export const KEYBOARD_SHORTCUTS = true;
