import axios from "axios";
import {INVOICE_ENDPOINT} from "../constants/api.ts";
import { saveAs } from 'file-saver';

function useDownloadInvoice() {
    async function downloadInvoice(id: string) {
        const response = await axios.get(`${INVOICE_ENDPOINT}/${id}`, {
            responseType: 'blob'
            });

        saveAs(response.data, `invoice-${id}.pdf`);
    }

    return {downloadInvoice}
}

export default useDownloadInvoice;