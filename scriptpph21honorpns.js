document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('simulasiForm');

    const formType = 'pph21honorpns';
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
        updatepphDuaSatuFinal();
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

    function updatepphDuaSatuFinal() {
        const golongan = form.elements['golongan'].value;
        const dasarPengenaan = parseFloat(form.elements['dasarPengenaan'].value.replace(/,/g, ''));

        let pphDuaSatuFinal;

        if (golongan === 'III') {
            pphDuaSatuFinal = Math.round(dasarPengenaan * 0.05);
        } else if (golongan === 'IV') {
            pphDuaSatuFinal = Math.round(dasarPengenaan * 0.15);
        } else {
            pphDuaSatuFinal = Math.round(dasarPengenaan * 0);
        }

        form.elements['pph21Final'].value = pphDuaSatuFinal.toString().replace(/\d(?=(\d{3})+$)/g, '$&,');
    }
});