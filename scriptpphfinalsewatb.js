document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('simulasiForm');

    const formType = 'pphfinalsewatb';
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
        updatepphFinal();
        updateNilaiPertambahanNilai();
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
        const pembayaranPpn = form.elements['pembayaranppn'].value;
        const pembayaran = form.elements['pembayaran'].value.replace(/,/g, '');

        let dasarPengenaan;

        if (pembayaranPpn === 'YA') {
            dasarPengenaan = (Math.round(parseFloat(pembayaran) * 0.900900900900901))
        } else {
            dasarPengenaan = (Math.round(parseFloat(pembayaran)))
        }

        form.elements['dasarPengenaan'].value = dasarPengenaan.toString().replace(/\d(?=(\d{3})+$)/g, '$&,');
    }

    function updatepphFinal() {
        const berNpwp = form.elements['npwp'].value;
        const dasarPengenaan = parseFloat(form.elements['dasarPengenaan'].value.replace(/,/g, ''));

        let pphFinal;

        if (berNpwp === 'YA') {
            pphFinal = Math.round(dasarPengenaan * 0.1);
        } else {
            pphFinal = dasarPengenaan;
        }

        form.elements['pphFinal'].value = pphFinal.toString().replace(/\d(?=(\d{3})+$)/g, '$&,');
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