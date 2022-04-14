const { Router } = require("express");
const { getAllReports, getOneReport } = require("./functions");

const router = Router();

router.get("/", async (req, res) => {
    try {
        const allReports = await getAllReports();
        res.status(200).json(allReports);
    } catch (error) {res.status(500).json({ message: "Error when trying to get all reports!", error: error.message })};
});

router.get("/:reportId", async (req, res) => {
    try {
        const { reportId } = req.params;
        const report = await getOneReport(reportId);
        res.status(200).json(report);
    } catch (error) {
        if (!error.status) error.status = 500;
        res.status(error.status).json({ message: "Error while trying to get one report!", error: error.message });
    };
});

module.exports = router;