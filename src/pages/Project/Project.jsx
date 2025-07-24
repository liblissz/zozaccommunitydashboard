import React, { useState } from 'react';
import './Project.css';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Project = () => {

    const [title, settitle] = useState("")
    const [description, setdescription] = useState("")
    const [startDate, setstartDate] = useState("")
    const [endDate, setendDate] = useState("")
    const [expectedCompletionTime, setexpectedCompletionTime] = useState("")
    const [category, setcategory] = useState("")
    const [budget, setbudget] = useState("")
    const [impact, setimpact] = useState("")
    const [createdBy, setcreatedBy] = useState("")

    const [loading, setloading] = useState(false)
    const handlesubmit = async (e) => {
        e.preventDefault()
        try {
            setloading(true)
            await axios.post("https://zozacbackend.onrender.com/api/company/project/post",
               { title,
                description,
                startDate,
                endDate,
                expectedCompletionTime,
                category,
                budget,
                impact,
                createdBy}
            )

   setbudget("")
   setcategory("")
   setcreatedBy("")
   setdescription('')
   setendDate("")
   setexpectedCompletionTime("")
   setimpact("")
   setstartDate("")
   settitle("")
        } catch (error) {
   toast.error(error)
        }finally{
            setloading(false)
        }
    }

    return (
        <>   
         <Toaster position="top-center" reverseOrder={false} />
        <div className="auth-container">
            <form className="form-wrapper" onSubmit={handlesubmit}>
                <div className="form-container" id="formContainer">

                    {/* Signup Form */}
                    <div className="form-side signup-form">
                        <div className="form-header">
                            <h1 className="form-title">Upload A Project</h1>
                            <p className="form-subtitle">starting our your journey</p>
                        </div>


                        <div className="form-row column">
                            <div className="form-group">
                                <label className="form-label">start date</label>
                                <input type="date" className="form-inpu inm" value={startDate} onChange={(e) => setstartDate(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">end date</label>
                                <input type="date" className="form-inpu inm" value={endDate} onChange={(e) => setendDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Title:</label>
                            <input name="expectedCompletionTime" value={title}
                                onChange={(e) => settitle(e.target.value)}
                                className="form-inpu inm" placeholder="Expected Time (hrs)" type="text" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Expected Completion Time:</label>
                            <input name="expectedCompletionTime" value={expectedCompletionTime}
                                onChange={(e) => setexpectedCompletionTime(e.target.value)}
                                className="form-inpu inm" placeholder="Expected Time (hrs)" type="number" />
                        </div>

                        <div className="form-group password-group">
                            <label className="form-label">Category:</label>
                            <input type='text' className="form-inpu inm" value={category} onChange={(e) => setcategory(e.target.value)} placeholder="Category" />
                        </div>
                        <div className="form-group password-group">
                            <label className="form-label">Impact:</label>
                            <input type='text' className="form-inpu inm" value={impact} onChange={(e) => setimpact(e.target.value)} placeholder="Impact" />
                        </div>
                        <div className="form-group password-group">
                            <label className="form-label">Created By:</label>
                            <input type='text' className="form-inpu inm" value={createdBy} onChange={(e) => setcreatedBy(e.target.value)} placeholder="Created By" />
                        </div>
                        <div className="form-group password-group">
                            <label className="form-label">Budget:</label>
                            <input type='number' className="form-inpu inm" value={budget} onChange={(e) => setbudget(e.target.value)} placeholder="Created By" />
                        </div>
                        <div className="form-group form-grou">
                            <label className="form-label form-labl">Project Description</label>
                            <textarea
                                name="description"
                                id="project-description"
                                className="form-textare"
                                value={description}
                                onChange={(e) => setdescription(e.target.value)}
                                placeholder="Write a clear and concise summary of the project..."
                                rows="5"

                                required
                            ></textarea>
                        </div>


                        <div className="form-options">

                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>{loading ? <ClipLoader /> : "upload Project"}</button>

                    </div>

                </div>
            </form>
        </div>
        </>
    );
};

export default Project;
