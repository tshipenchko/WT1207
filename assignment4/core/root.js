export const task_created = new Audio("../audio/task_created.mp3")
export const bong = new Audio("../audio/bong.mp3")
export const error_sound = new Audio("../audio/error.mp3")
export const success = new Audio("../audio/success.mp3")

export const showAlert = (message, type, timeout = 1000) => {
    // message: string
    // type: string -> primary, secondary, success, danger, warning, info, light, dark
    // timeout: int -> milliseconds

    const alertElement = $(
        `<div class="alert alert-${type} alert-dismissible show fade" role="alert">${message}` +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'
        + '</div>'
    );

    alertElement.css({
        "position": "fixed",
        "top": "10px",
        "right": "10px",
        "z-index": "9999",
        "width": "300px",
    });

    $('body').append(alertElement);

    setTimeout(() => {
        alertElement.alert('close');
    }, timeout);
};
