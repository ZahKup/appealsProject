import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Home(){

    const [cancelText, setCancelText] = useState('Отменить все активные обращения');
    const [items, setItems] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
      const fetchItems = async () => {
        try {
          const response = await fetch('http://localhost:5000/items');
          if(!response.ok){
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setItems(data);
        }
        catch (error){
          console.log(error);
  
        }
      } 
      fetchItems();
    }, [])

    const cancelAll = async() => {
      try{
        const tryCancel = await fetch('http://localhost:5000/cancel-all', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
        if(tryCancel){
          setCancelText('Активные обращения автоматически отменены. Перезагрузите страницу')
        }
      }
      catch (error){
        console.log(error)
      }
    }
  
    const filterByDates = async() => {

      const dates = {
        startDate: startDate,
        endDate: endDate
      }

      try{
        const tryFilter = await fetch('http://localhost:5000/filter', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dates)
        })
        if(tryFilter){
          const filteredAppeals = await tryFilter.json();
          setItems(filteredAppeals);
        }
      }
      catch(error){
        console.log(error);
      }
    }

    return(
      <div>
      <div className="calendar">
        <DatePicker className="date-input"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd.MM.yyyy"
          placeholderText="Выберите начальную / одиночную дату"
        />
        <DatePicker className="date-input"
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="dd.MM.yyyy"
          placeholderText="Выберите конечную дату"
        />
        <button onClick={filterByDates} className="button">Отфильтровать обращения</button>
      </div>
      <div className="wrapper">
            <h1>Обращения</h1>
            <div className="appeals-container">
            {items.map((item, index) => (
                <Link className="appeals__item" key={index} to={`/appeal/${item._id}`}>
                <div className="appeals__item-top">
                    <div className="appeal-header">{item.title}</div>
                    <div className={`appeal-status ${item.status}`}>{item.status_cyr}</div>
                </div>
                <p className="appeal-date">От {new Date(item.date).toLocaleDateString('ru-RU')}</p>
                </Link>
            ))}
            </div>
            <Link className="button" to="/add">Создать обращение</Link>
            <div className="button" onClick={cancelAll}>{cancelText}</div>
            </div>
        </div>
    )
}