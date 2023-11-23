document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('simulasiForm');

    const formType = 'pph21honornonpns';
    document.getElementById('formType').value = formType;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Mengumpulkan data formulir
        const formData = new FormData(event.target);
        const jsonData = {};
    
        formData.forEach(function(value, key){
            jsonData[key] = value;
        });

        jsonData['formType'] = formType;
    
        fetch('https://script.google.com/macros/s/AKfycbzddEAPRiLd4gwrtQtZD94Lhf9Bl7WSBn9L8u10sIWNaXMmlPAYo2ZXSmNzc_e_INRXrg/exec', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData),
            mode: 'no-cors'
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error('Error:', error));
    });

    form.addEventListener('input', function() {
        updateDasarPengenaan();
        updatepphDuaSatuNonFinal();
        updatepphDuaSatuNonFinalNonNpwp();
    });

    function formatNumber(input) {
        let value = input.value.replace(/\D/g, "");
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        input.value = value;
    }

    var pembayaranInput = document.getElementById("pembayaran");

    pembayaranInput.addEventListener("input", function () {
    formatNumber(pembayaranInput);
    });
    
    function updateDasarPengenaan() {
        const pembayaran = form.elements['pembayaran'].value.replace(/,/g, '');

        let dasarPengenaan = pembayaran;

        form.elements['dasarPengenaan'].value = dasarPengenaan.toString().replace(/\d(?=(\d{3})+$)/g, '$&,');
    }

    function updatepphDuaSatuNonFinal() {
        const berNpwp = form.elements['npwp'].value;
        const dasarPengenaan = parseFloat(form.elements['dasarPengenaan'].value.replace(/,/g, ''));

        let pphDuaSatuNonFinal;

        if (berNpwp === 'TIDAK') {
            pphDuaSatuNonFinal = 0;
        } else if (dasarPengenaan <= 60000000) {
            pphDuaSatuNonFinal = Math.round(dasarPengenaan * 0.05);
        } else if (dasarPengenaan <= 250000000) {
            pphDuaSatuNonFinal = Math.round(3000000 + (dasarPengenaan - 60000000) * 0.15);
        } else if (dasarPengenaan <= 500000000) {
            pphDuaSatuNonFinal = Math.round(31500000 + (dasarPengenaan - 250000000) * 0.25);
        } else if (dasarPengenaan <= 5000000000) {
            pphDuaSatuNonFinal = Math.round(94000000 + (dasarPengenaan - 500000000) * 0.3);
        } else {
            pphDuaSatuNonFinal = Math.round(1444000000 + (dasarPengenaan - 5000000000) * 0.35);
        }

        form.elements['pph21nonFinal'].value = pphDuaSatuNonFinal.toString().replace(/\d(?=(\d{3})+$)/g, '$&,');
    }

    function updatepphDuaSatuNonFinalNonNpwp() {
        const berNpwp = form.elements['npwp'].value;
        const dasarPengenaan = parseFloat(form.elements['dasarPengenaan'].value.replace(/,/g, ''));

        let pphDuaSatuNonFinalNonNpwp;

        if (berNpwp === 'YA') {
            pphDuaSatuNonFinalNonNpwp = 0;
        } else if (dasarPengenaan <= 60000000) {
            pphDuaSatuNonFinalNonNpwp = Math.round(dasarPengenaan * 0.05 * 1.2);
        } else if (dasarPengenaan <= 250000000) {
            pphDuaSatuNonFinalNonNpwp = Math.round(3600000 + (dasarPengenaan - 60000000) * 0.15 * 1.2);
        } else if (dasarPengenaan <= 500000000) {
            pphDuaSatuNonFinalNonNpwp = Math.round(37800000 + (dasarPengenaan - 250000000) * 0.25 * 1.2);
        } else if (dasarPengenaan <= 5000000000) {
            pphDuaSatuNonFinalNonNpwp = Math.round(112800000 + (dasarPengenaan - 500000000) * 0.3 * 1.2);
        } else {
            pphDuaSatuNonFinalNonNpwp = Math.round(1732800000 + (dasarPengenaan - 5000000000) * 0.35 * 1.2);
        }

        form.elements['pph21nonFinalnonNpwp'].value = pphDuaSatuNonFinalNonNpwp.toString().replace(/\d(?=(\d{3})+$)/g, '$&,');
    }
});