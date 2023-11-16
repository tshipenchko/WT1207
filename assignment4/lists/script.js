import {todoService} from "../core/todoService.mjs";
import {success, error_sound, bong, task_created, showAlert} from "../core/root.js"

const eventListsChanged = () => {
    document.dispatchEvent(new CustomEvent("custom:listsChanged"));
}


$(() => {
    // It is the same as $(document).ready(function() { ... });
    // This block will be executed once the page has been loaded
    // Some kind of unnecessary code, when the script tag is at the end of the body

    renderLists();
    document.addEventListener('custom:listsChanged', renderLists);
})

$(() => {
    const $modal = $("#addListModal");
    const $form = $modal.find("form");

    const $title = $form.find("#title");
    const $description = $form.find("#description");
    const $confirm = $modal.find(".btn-primary");
    const $close = $modal.find(".btn-secondary");

    const onConfirm = () => {
        const title = $title.val();
        let isValid = true;
        if (!title) {
            $title.addClass("is-invalid");
            isValid = false;
        }

        const description = $description.val();
        if (!description) {
            $description.addClass("is-invalid");
            isValid = false;
        }

        if (!isValid) {
            error_sound.play().then();
            showAlert("Please fill all fields", "danger");
            return;
        }

        todoService.createList(title, description);
        eventListsChanged();

        // noinspection JSUnresolvedReference
        $modal.modal("toggle");
        task_created.play().then();
        showAlert("List created", "success");
    }

    $confirm.click(onConfirm);
    $(document).keypress(function (event) {
        if (!$modal.hasClass("show")) {
          return;
        }
        let keycode = (event.keyCode || event.which);
        if (keycode === 13 && event.ctrlKey) {
            onConfirm();
        }
        event.stopPropagation();
    });
    $confirm.mouseover(() => {
        $confirm.attr("title", "Click to confirm");
    })
    $close.mouseover(() => {
        $close.attr("title", "Click to close");
    });
    $modal.on("hidden.bs.modal", () => {
        $form.trigger("reset");
        $title.removeClass("is-invalid");
        $description.removeClass("is-invalid");
    });
    $title.on("input", () => $title.removeClass("is-invalid"));
    $description.on("input", () => $description.removeClass("is-invalid"));
})


const renderLists = () => {
    const $lists = $("#lists");
    $lists.empty();

    if (!todoService.lists.length) {
        $lists.append(`
            <div class="list p-3 mb-3 rounded-3">
                <h3 class="list-name">No lists</h3>
                <p class="list-description">Create a new list</p>
            </div>
        `);
        return;
    }

    todoService.lists.forEach(list => {
        const $list = $(`
            <div class="list p-3 mb-3 rounded-3">
                <h3 class="list-name">${list.title}</h3>
                <p class="list-description">${list.description}</p>
                <div class="list-actions">
                    <a href="../list/index.html?listId=${list.id}" class="btn btn-primary btn-lg">
                        Open
                    </a>
                    <button class="btn btn-danger btn-lg ms-1">Delete</button>
                </div>
            </div>
        `);

        $list.find('.btn-danger').click(() => {
            bong.play().then();
            todoService.deleteList(list.id);
            eventListsChanged();
        });

        $("#lists").append($list);
    });
}
