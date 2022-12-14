
import { useEffect, useState, useRef } from "react";




const UpdateReg = () => {
    
    
    const [firstName, setFirstname] = useState('')
    const [lastName, setLastname] = useState('')
    const [idNum, setIdNum] = useState('')
    const [grade, setGrade] = useState('')
    const [dob, setDob] = useState('')
    const [email, setEmail] = useState('')
    const [eventsAtt, setEventsAttended] = useState([])
    const [savedPopUp, setPopUp] = useState(false)
    const listReset = useRef([])
    let eventUrl;
    const [searchSignal, setSignal] = useState(false);
    const [filter, setFilter] = useState([])
    const [activities, setActivities] = useState(null)
    const [eventStates, setEvents] = ([])
    
    useEffect(()=>{
        eventUrl = filter.length == 0 ? '/api/MERN/Events/' :`/api/MERN/Events/${searchSignal === true ? "name" : "filter"}/` + `${filter}`
        fetch(eventUrl)
        .then(res =>{ return res.json()})
        .then(data => {
            setActivities(data)
        })
        
    }, [filter])

    useEffect(()=>{
        listReset.current.forEach(act =>{
            if(act !== null){
                if(eventsAtt.includes(act.dataset.key)){
                act.classList.add("activated")
            }
            else{
                act.classList.remove("activated")
            }
            }
        })
        
    }, [activities])
    

    const updateUrl = (name, order) =>{
        if(order === "remove"){
            setFilter(filter.splice(filter.indexOf(`[${name}]`), 1))
            if(filter.length === 0){setFilter([])}
        }
        else if (order === "asc"){
            setFilter(filter => [...filter, [`${name}`, "asc"]])
        }
        else if(order === "desc"){
            setFilter(filter.splice(filter.indexOf(`${name}`, "asc"), 1))
            if(filter.length === 0){
                setFilter([])
            }
            setFilter(filter => [...filter, [`${name}`, "desc"]])
        }

    }
    


    const toDate = (date) =>{
        let nDate = new Date(date)
        return (nDate).toLocaleDateString()
    }
    
    const handleSubmit = (e) =>{
        e.preventDefault()
        let student;
        if(eventsAtt){
            student = {firstName , lastName , idNum, grade, dob, email, eventsAttended : eventsAtt}
        }
        else{
            student = {firstName , lastName , idNum, grade, dob, email}
        }   
        setFirstname('')
        setLastname('')
        setIdNum('')
        setGrade('')
        setDob('')
        setEmail('')
        if(eventsAtt){
            listReset.current.forEach( e=>{
                if(e.classList == "activated"){
                    e.classList.toggle("activated")
                }
            })
        }
        setPopUp(true)
        fetch('/api/MERN/Students/', {
        method : 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify(student)
        }).then((data) =>{
            return data.json()
        }).catch( e=>{
        console.log('error saving student')
        })  
    }
        
    return (
        <form className="RegisterPage" onSubmit={handleSubmit}>
                {savedPopUp && 
                <div className="popUp">
                    Saved Student
                </div>
            }
                { activities && <h1 className="registerLabel"> Enter New Student Information</h1> } 
                { activities && <main className="registerField">
                <section className="inputField">       
                    <input type="text" id="firstName" className="input" placeholder="First Name" value = {firstName} onChange={(e) =>{
                        setFirstname(e.target.value)
                        }}/>           
                    <input type="text" id="lastName" className="input" placeholder="Last Name" value = {lastName} onChange={(e) =>{
                        setLastname(e.target.value)
                        }}/>       
                    <span className="idNgrade">
                        <input type="text" id="idNumber" className="input" placeholder="ID Number" value = {idNum} onChange={(e) =>{
                        if(e.target.value.length >= 8){
                            return false;
                        }
                        setIdNum(e.target.value)
                        }}/>
                        <select id="grade" className="input" value = {grade} onChange={(e) =>{
                        setGrade(e.target.value)
                        }}>
                            <option value="" disabled selected hidden> Grade </option> 
                            <option value="6th"> 6th </option>    
                            <option value="7th"> 7th </option>  
                            <option value="8th"> 8th </option>  
                            <option value="9th"> 9th </option>  
                            <option value="10th"> 10th </option>  
                            <option value="11th"> 11th </option>  
                            <option value="12th"> 12th </option>  
                        </select>
                    </span>
                    <input type="date" id="dateOfBirth" className="input" placeholder="Date of Birth" value = {dob} onChange={(e) =>{
                        setDob(e.target.value)
                        }}/>
                    <input type="text" id="email" className="input" placeholder="E-mail" value = {email} onChange={(e) =>{
                        
                        setEmail(e.target.value)
                        }}/>
                </section>
                <section className="eventsAttend">
                    <input type="text" id="eventSearch" placeholder="Search" onChange={ (e)=>{
                        if(e.target.value.length == 0){
                            setSignal(false);
                            setFilter([])
                        }else{
                            setSignal(true);
                            setFilter(e.target.value)
                        }


                    }}/>
                    <div className="events">
                        <nav  className="filter">
                                <div className="NameFilter filter type" data-state='descending' onClick={(e)=>{
                                  switch (e.target.dataset["state"]) {
                                        case "descending":
                                            setFilter(["eventName", "asc"])
                                            e.target.dataset["state"] = "ascending"
                                            break;
                                        case "ascending" :
                                            setFilter(["eventName", "desc"])
                                            e.target.dataset["state"] = "descending"
                                            break;
                                        default:
                                            console.log("Filter not working")
                                        break;
                                    } 
                                }}> Name </div>
                                <div className="filter type" data-state="descending" onClick={(e)=>{
                                     console.table(filter)
                                     switch (e.target.dataset["state"]) {
                                        case "descending":
                                            setFilter(["eventDate", "desc"])
                                            e.target.dataset["state"] = "ascending"
                                            break;
                                        case "ascending":
                                            setFilter("eventDate", "asc")
                                            e.target.dataset["state"] = "descending"
                                            break;
                                        default:
                                            console.log("Filter not working")
                                        break;
                                    }
                                }} > Date  <span><div className="up-arrow"/><div className="down-arrow"/></span></div>
                                <div className="filter type" data-state="descending"onClick={(e)=>{
                                     switch (e.target.dataset["state"]) {
                                        case "descending":
                                            setFilter(["pointWorth", "desc"])
                                            e.target.dataset["state"] = "ascending"
                                            break;
                                        case "ascending":
                                            setFilter("pointWorth", "asc")
                                            e.target.dataset["state"] = "descending"
                                            break;
                                        default:
                                            console.log("Filter not working")
                                        break;
                                    }
                                }}> Points  <span><div className="up-arrow"/><div className="down-arrow"/></span></div>
                                <div className="filter type" onClick={()=>{
                                    console.log(eventsAtt)
                                }}> Type </div>

                            </nav>
                            <ul className="activities">
                            {activities.map( (activities, idx) =>(
                                <li key = {idx} ref={(el) => (listReset.current[idx] = el)} data-key={activities._id} data-name = {activities.eventName} onClick={(e) =>{ 
                                    e.target.classList.toggle("activated")                                 
                                    if(eventsAtt.includes(activities._id)){
                                        setEventsAttended(eventsAtt => eventsAtt.filter(word => word !== (activities._id)))
                                    }
                                    else{
                                        setEventsAttended( eventsAtt => [...eventsAtt, activities._id])
                                    }
                                    }}> 
                                <span className="actLi"> 
                                    <div className="act"> {activities.eventName} </div> 
                                    <div className="act"> {toDate(activities.eventDate)} </div>
                                    <div className="act ">{ activities.pointWorth} Points</div> 
                                    <div className="act sport"> {activities.eventType}</div> 
                                </span>
                                </li>
                            ))}
                            </ul>
                    </div>
                </section>
            </main> }
            { activities && <button className="registerBut"> Register </button>}
        </form> );
    }
        
export default UpdateReg;
    



    


