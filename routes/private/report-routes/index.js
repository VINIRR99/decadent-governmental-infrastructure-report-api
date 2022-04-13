const { Router } = require("express");
const { postNewReport, updateReport, deleteReport } = require("./functions");

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { _id: userId } = await req.user;
        const newReport = await postNewReport(userId, await req.body);
        res.status(201).json(newReport);
    } catch (error) {
        if (!error.status) error.status = 500;
        res.status(error.status).json({ message: "Error while creating new Reports!", error: error.message });
    };
});

router.put("/:reportId", async (req, res) => {
    try {
        const { reportId } = req.params;
        const { _id: userId } = await req.user;
        const updatedReport = await updateReport(reportId, userId, await req.body);
        res.status(200).json(updatedReport);
    } catch (error) {
        if (!error.status) error.status = 500;
        if ((error.status === 500) && (error.path === "_id")) {
            error.status = 404;
            error.message = "The provided _id for the report does not match any report in our database!";
        };
        res.status(error.status).json({ message: "Error when trying to update report!", error: error.message  });
    };
});

router.delete("/:reportId", async (req, res) => {
    try {
        const { reportId } = req.params;
        const { _id: userId } = await req.user;
        await deleteReport(reportId, userId);
        res.status(204).json();
    } catch (error) {
        if (!error.status) error.status = 500;
        res.status(error.status).json({ message: "Error while trying to delete report!", error: error.message });
    };
});

module.exports = router;