import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";

export default function Add(){

    const navigate = useNavigate();
    const [title, setHeader] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();

        const newAppeal = {
            title, 
            content
        }

        try{
            const response = await fetch('http://localhost:5000/add-appeal', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAppeal)
            })
            if (response.ok) {
                setHeader('');
                setContent('');
                navigate('/')
            }
        }
        catch (error){
            console.error('Error submitting appeal:', error);
        }
    }

    return(
        <div className="App">
            <div className="wrapper">
                <Link className="back" to="/">Назад</Link>
                <h1>Создать обращение</h1>
                <form onSubmit={handleSubmit} className="add-form">
                    <input type="text" value={title} onChange={(e) => {setHeader(e.target.value)}} />
                    <textarea name="" id="" value={content} onChange={(e) => {setContent(e.target.value)}}></textarea>
                    <input type="submit" value="Создать обращение" className="button" />
                </form>
            </div>
        </div>
    )
}