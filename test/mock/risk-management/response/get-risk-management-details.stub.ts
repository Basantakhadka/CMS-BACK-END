export const GetRiskManagementDetailsStub = () => {
    return {
        id: "1",
        title: "Test",
        isEnabled: true,
        isDefault: true,
        mccCode: "5119",
        mcc: "MCC1-5119",
        transactionVelocitySetup: [
            {
                id: "1",
                paymentPoint: "POS",
                paymentMode: [
                    "QR"
                ],
                perMinuteTxnLimit: "10",
                actionOnExceedPerMinuteTxnLimit: "ALERT",
                perDayTxnLimit: "10",
                actionOnExceedPerDayTxnLimit: "ALERT",
                perMonthTxnLimit: "10",
                actionOnExceedPerMonthTxnLimit: "ALERT",
                perYearTxnLimit: "10",
                actionOnExceedPerYearTxnLimit: "ALERT"
            },
            {
                id: "2",
                paymentPoint: "POS",
                paymentMode: [
                    "QR"
                ],
                perMinuteTxnLimit: "10",
                actionOnExceedPerMinuteTxnLimit: "ALERT",
                perDayTxnLimit: "10",
                actionOnExceedPerDayTxnLimit: "ALERT",
                perMonthTxnLimit: "10",
                actionOnExceedPerMonthTxnLimit: "ALERT",
                perYearTxnLimit: "10",
                actionOnExceedPerYearTxnLimit: "ALERT"
            }
        ],
        transactionVolumeSetup: [
            {
                id: "1",
                paymentPoint: "POS",
                paymentMode: [
                    "QR"
                ],
                minAllowedAmountPerTxn: "10.10",
                actionOnFailMinAllowedAmountPerTxn: "ALERT",
                maxAllowedAmountPerTxn: "10.10",
                actionOnExceedMaxAllowedAmountPerTxn: "ALERT",
                allowedTxnAmountPerDay: "10.10",
                actionOnExceedAllowedTxnAmountPerDay: "ALERT",
                allowedTxnAmountPerMonth: "10.10",
                actionOnExceedAllowedTxnAmountPerMonth: "ALERT",
                allowedTxnAmountPerYear: "10.01",
                actionOnExceedAllowedTxnAmountPerYear: "ALERT"
            },
            {
                id: "2",
                paymentPoint: "POS",
                paymentMode: [
                    "QR"
                ],
                minAllowedAmountPerTxn: "10.10",
                actionOnFailMinAllowedAmountPerTxn: "ALERT",
                maxAllowedAmountPerTxn: "10.10",
                actionOnExceedMaxAllowedAmountPerTxn: "ALERT",
                allowedTxnAmountPerDay: "10.10",
                actionOnExceedAllowedTxnAmountPerDay: "ALERT",
                allowedTxnAmountPerMonth: "10.10",
                actionOnExceedAllowedTxnAmountPerMonth: "ALERT",
                allowedTxnAmountPerYear: "10.01",
                actionOnExceedAllowedTxnAmountPerYear: "ALERT"
            }
        ]
    };
}


export const GetRiskManagementEmptyVelocityAndVolumeDetailsStub = () => {
    return {
        id: "2",
        title: "Test1",
        isEnabled: true,
        isDefault: true,
        mccCode: "5119",
        mcc: "MCC1-5119",
        transactionVelocitySetup: [],
        transactionVolumeSetup: []
    };
}