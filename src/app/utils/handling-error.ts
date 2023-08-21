import { Observable, of } from "rxjs"
import Swal from "sweetalert2";
import { mapToListHtml, swalError } from "./app-util";
import { HttpErrorResponse } from "@angular/common/http";

function handlingError(error: any): Observable<any> {
    if (error instanceof HttpErrorResponse) {
        switch (error.status) {
            case 400:
                swalError(undefined, mapToListHtml(error.error.errors));
                break;
            default:
                if (error.error) {
                    swalError(undefined, error.error.errors);
                    break;
                }
        }
    }
    return of();
}

export default handlingError;