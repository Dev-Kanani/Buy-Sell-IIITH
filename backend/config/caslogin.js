import User from "../models/user.js";
import jwt from "jsonwebtoken";
import xml2js from "xml2js";
import axios from "axios";

export const initiateCASLogin = async (req, res) => {
    try {
        const serviceURL = `${process.env.FRONTEND_URL}/api/cas-callback`;

        console.log("Service URL", serviceURL);

        const casLoginURL = `https://login.iiit.ac.in/cas/login?service=${encodeURIComponent(serviceURL)}`;

        console.log('Redirecting to CAS:', casLoginURL);

        return res.redirect(casLoginURL);
    } catch (error) {
        console.error('CAS Initiation Error:', error);
        return res.status(500).json({ message: "Error initiating CAS login" });
    }
};

export const handleCASCallback = async (req, res) => {
    console.log("CAS Callback Triggered");
    console.log("Query Params:", req.query);

    const { ticket } = req.query;

    console.log('CAS Callback Ticket:', ticket);

    const serviceURL = `${process.env.FRONTEND_URL}/api/cas-callback`;

    if (!ticket) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_ticket`);
    }

    try {
        const serviceURL = `${process.env.FRONTEND_URL}/api/cas-callback`;

        const validateURL = `https://login.iiit.ac.in/cas/serviceValidate?ticket=${ticket}&service=${encodeURIComponent(serviceURL)}`;

        console.log("CAS Validation URL:", validateURL);

        const response = await axios.get(validateURL);
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(response.data);

        const serviceResponse = result['cas:serviceResponse'];

        if (serviceResponse['cas:authenticationSuccess']) {
            const userData = serviceResponse['cas:authenticationSuccess'];
            const email = userData['cas:attributes']['cas:E-Mail'];
            const name = userData['cas:attributes']['cas:Name'];
            const rollNo = userData['cas:attributes']['cas:RollNo'];

            console.log("CAS User Data:", email, name, rollNo);
            console.log("User authenticated: ", email);


            let user = await User.findOne({ email });

            // if (!user) {
            //     user = await User.create({
            //         email,
            //         firstName: name,
            //         lastName: "write your last name",
            //         password: "defaultpassword",
            //         age: 18,
            //         contactNumber: "0000000000",
            //     });
            // }

            console.log("User found/created:", user);

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            // console.log("JWT Token:", token);

            // await new Promise(resolve => setTimeout(resolve, 1000));

            return res.redirect(`http://localhost:5173/login?token=${token}`);
        } else {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }
    } catch (error) {
        console.error('CAS Authentication Error:', error);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
};


export default { initiateCASLogin, handleCASCallback };