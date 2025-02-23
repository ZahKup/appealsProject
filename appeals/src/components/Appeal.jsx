import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

export default function Appeal(){

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('');
    const [statusCyr, setStatusCyr] = useState('');
    const [answer, setAnswer] = useState('');
    const {id} = useParams();
    const [showCancelWindow, setShowCancelWindow] = useState(false);
    const [showCompleteWindow, setShowCompleteWindow] = useState(false);

    useEffect(() => {

        const fetchAppeal = async () => {
            try{
                const response = await fetch('http://localhost:5000/get-appeal', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id }),
                })
                if (response) {
                    const data = await response.json();
                    setTitle(data.title);
                    setContent(data.content);
                    setStatus(data.status);
                    setStatusCyr(data.status_cyr);
                    setAnswer(data.answer);
                } else {
                }
            }
            catch (error){
                console.log(error);
            }
        }

        fetchAppeal();
        
    }, [])

    const changeStatus = async (stat, cyrstat) => {
        

        const values = {
            id, 
            stat, 
            cyrstat,
            answer
        }

        try{
            const changeStatusFetch = await fetch('http://localhost:5000/change-status', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values)
            })
            if (changeStatusFetch) {
                const data = await changeStatusFetch.json();
                setStatus(data.status);
                setStatusCyr(data.status_cyr);
                setShowCancelWindow(false);
                setShowCompleteWindow(false);
            } else {
                console.log(changeStatusFetch)
                console.error("Failed to fetch appeal:", changeStatusFetch.statusText);
            }
            }
        catch (error){
            console.log(error)
        }
    }

    function cancelWindow(){
        setShowCancelWindow(true);
        setShowCompleteWindow(false)
    }

    function completeWindow(){
        setShowCancelWindow(false);
        setShowCompleteWindow(true)
    }


    return(
        <div className="App">
            <div className="wrapper">
            <Link className="back" to="/">Назад</Link>
                <h1>{title}</h1>
                <div className={`appeal-status ${status}`}>{statusCyr}</div>
                <p className="appeal-content">{content}</p>
                {(status === 'complete' || status === 'cancel') && answer && (
                    <div>
                        <p>Ответ от подержки:</p>
                        <p className="appeal-content">{answer}</p>
                    </div>
                )}
                <div className="flex">
                    {status == 'new' && (<div className="button" onClick={() => {changeStatus('work', 'В работе')}}>Взять в работу</div>)}
                    {status == 'work' && (<div className="button" onClick={cancelWindow}>Отменить</div>)}
                    {status == 'work' && (<div className="button" onClick={completeWindow}>Завершено</div>)}
                </div>
                {showCancelWindow && (
                    <form onSubmit={(e) => {e.preventDefault(); changeStatus('cancel', 'Отменено')}}>
                        <p>Причина отмены?</p>
                        <textarea name="" id="" value={answer} onChange={(e) => setAnswer(e.target.value)}></textarea>
                        <input type="submit" value="Отправить" className="button"/>
                    </form>
                )}
                {showCompleteWindow && (
                    <form onSubmit={(e) => {e.preventDefault(); changeStatus('complete', 'Завершено')}}>
                        <p>Укажите решение проблемы</p>
                        <textarea name="" id="" value={answer} onChange={(e) => setAnswer(e.target.value)}></textarea>
                        <input type="submit" value="Отправить" className="button"/>
                    </form>
                )}
            </div>
        </div>
    )
}