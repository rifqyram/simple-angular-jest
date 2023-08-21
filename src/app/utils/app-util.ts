import Swal from "sweetalert2";

export function mapToListHtml(obj: any): string {
    let result = '<ul">';

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            result += `<li>${obj[key]}</li>`;
        }
    }

    result += '</ul>';
    return result;
}

export function swalSuccess(message: string) {
    Swal.fire({
        title: 'Success',
        text: message,
        icon: 'success',
        confirmButtonColor: '#0d6efd'
    })
}

export function swalConfirm(message: string, execute: () => void) {
    Swal.fire({
        icon: 'info',
        title: 'Confirm',
        text: message,
        showCancelButton: true,
        confirmButtonText: 'Remove',
        confirmButtonColor: '#dc3545'
    }).then(res => {
        if (res.isConfirmed) {
            execute();
            swalSuccess('Success Removed')
        }
    })
}

export function swalError(title: string = 'An Error Occurred!', errors: string) {
    Swal.fire({
        title: title,
        html: errors,
        icon: 'error',
        confirmButtonColor: '#0d6efd'
    })
}