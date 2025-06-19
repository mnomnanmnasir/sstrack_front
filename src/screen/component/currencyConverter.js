import axios from 'axios';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const CurrencyConverter = ({ userId, payrate, onPayrateUpdate }) => {

    const apiUrl = process.env.REACT_APP_API_URL;
    let token = localStorage.getItem("token");
    let headers = {
        Authorization: "Bearer " + token,
    };
    const [convertedAmount, setConvertedAmount] = useState(null)

    const [formData, setFormData] = useState({
        amount: null,
        currency: "",
        rateType: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }


    const handleConvert = async () => {
        const { value: inputValue } = await Swal.fire({
            title: 'Set payrate',
            html:
                `<input type="number" name="amount" value=" placeholder='Set your pay amount' ${formData.amount}" required placeholder='Set your pay amount' step="any" min="0" class="swal2-input">` +
                // <input type="number" name="amount" placeholder="Set your pay amount" value="${formData.amount || ''}">
                `<select name="currency" class="swal2-input" id="swal-currency-select" value="${formData.currency}">
           <option value="USD">USD</option>
           <option value="QAR">QAR</option>
           <option value="PKR">PKR</option>
           <option value="SAR">SAR</option>
           <option value="AED">AED</option>
           <option value="PHP">PHP</option>
           <option value="INR">INR</option>


         </select>` +
                `<select name="rateType" class="swal2-input" id="swal-rate-select" value="${formData.rateType}">
           <option value="hourly">Hourly Rate</option>
           <option value="monthly">Monthly Rate</option>
    
         </select>`,
            focusConfirm: false,
            confirmButtonText: "Set",
            confirmButtonColor: "#50AA00",
            showCloseButton: true,
            showCancelButton: true,
            preConfirm: () => {
                return [
                    document.getElementById('swal-currency-select').value,
                    parseFloat(document.querySelector('.swal2-input[name="amount"]').value),
                    document.getElementById('swal-rate-select').value
                ];
            }
        })

        if (inputValue) {
            const [selectedCurrency, selectedAmount, selectedRateType] = inputValue;
            if (selectedCurrency === 'usd') {
                setConvertedAmount(selectedRateType === 'hourly' ? selectedAmount * 294.12 : selectedAmount * 160)
            } else {
                setConvertedAmount(selectedRateType === 'hourly' ? selectedAmount / 294.12 : selectedAmount / 160)
            }
            setFormData({
                amount: selectedAmount,
                currency: selectedCurrency,
                rateType: selectedRateType
            });
        }
    }

    async function setPayrate() {
        console.log(formData);
        try {
            const res = await axios.patch(`${apiUrl}/superAdmin/UpdateBillingInfo/${userId}`, {
                ratePerHour: formData.amount,  // Sending payrate
                currency: formData.currency,   // Sending currency
                payType: formData.rateType    // Sending Hourly/Monthly type
            }, {
                headers: headers
            });

            console.log("Curreny", res);
            if (res.status) {
                setFormData({
                    amount: null,
                    currency: "",
                    payType: ""
                });

                // ⬇️ Notify parent of update
                if (onPayrateUpdate) {
                    onPayrateUpdate({
                        ratePerHour: formData.amount,
                        currency: formData.currency,
                        payType: formData.rateType
                    });
                }

                enqueueSnackbar("Payrate successfully set", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
            }

            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (formData.amount) {
            setPayrate()
        }
    }, [formData])

    return (
        <>
            <SnackbarProvider />
            <button style={{
                border: 0,
                backgroundColor: "rgb(40, 101, 156)",
                color: "#FFFFFF",
                borderRadius: "5px",
                // padding: "10px",
                width: "140px",
                height: "43px",
                fontSize: "16px",
                fontWeight: 500,
            }} onClick={handleConvert}>{payrate?.billingInfo ? "Edit payrate" : "Set payrate"}</button>
        </>
    );
}

export default CurrencyConverter;
