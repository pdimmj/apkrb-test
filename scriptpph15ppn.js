document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('simulasiForm');

    const formType = 'ppn15';
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
        updateNilaiPenghasilan15();
        updateNilaiPertambahanNilai();
    });

    function formatNumber(input) {
        let value = input.value.replace(/\D/g, "");
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        input.value = value;
    }

    var nominalInput = document.getElementById("nominal");

    nominalInput.addEventListener("input", function () {
    formatNumber(nominalInput);
    });
    
    function updateDasarPengenaan() {
        const pembayaranAJenis = form.elements['pembayaranA'].value;
        const nominalPembayaran = form.elements['nominal'].value.replace(/,/g, '');

        let dasarPengenaan;

        if (pembayaranAJenis === 'YA') {
            dasarPengenaan = (Math.round(parseFloat(nominalPembayaran) * 0.900900900900901))
        } else {
            dasarPengenaan = (Math.round(parseFloat(nominalPembayaran)))
        }

        form.elements['dasarPengenaan'].value = dasarPengenaan.toString().replace(/\d(?=(\d{3})+$)/g, '$&,');
    }

    function updateNilaiPenghasilan15() {
        const objekPembayaran = form.elements['objekPembayaran'].value;
        const dasarPengenaan = parseFloat(form.elements['dasarPengenaan'].value.replace(/,/g, ''));

        let nilaiPenghasilan15;

        if (objekPembayaran === 'Pembayaran Tanah') {
            nilaiPenghasilan15 = Math.round(dasarPengenaan * 0.018);
        } else if (objekPembayaran === 'Pembayaran Bangunan') {
            nilaiPenghasilan15 = Math.round(dasarPengenaan * 0.012);
        } else {
            nilaiPenghasilan15 = Math.round(dasarPengenaan * 0.0264);
        }

        form.elements['nilaiPenghasilan15'].value = nilaiPenghasilan15.toString().replace(/\d(?=(\d{3})+$)/g, '$&,');
    }

    function updateNilaiPertambahanNilai() {
        const rekanan = form.elements['rekanan'].value;
        const dasarPengenaan = parseFloat(form.elements['dasarPengenaan'].value.replace(/,/g, ''));

        let nilaiPertambahanNilai;

        if (dasarPengenaan >= 2000000 && rekanan === "YA") {
            nilaiPertambahanNilai = Math.round(dasarPengenaan * 0.11);
        } else {
            nilaiPertambahanNilai = 0;
        }

        form.elements['nilaiPertambahanNilai'].value = nilaiPertambahanNilai.toString().replace(/\d(?=(\d{3})+$)/g, '$&,');
    }
});