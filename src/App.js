import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import the custom CSS

const App = () => {
  const [savingsPlan, setSavingsPlan] = useState(() =>{
    const savedPlan = localStorage.getItem('savingsPlan');
    return savedPlan ? JSON.parse(savedPlan) : []; //load from local storage on initialization
  });

  // Fetching the savings plan from the API
  useEffect(() => {
    axios
      .get("http://localhost:5179/api/SavingsPlan")
      .then((response) => {
        setSavingsPlan(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data ", error);
      });
  }, []);


  // Handling Checkbox change
  const handleCheckboxChange = (week) => {
    const updatePlan = savingsPlan.map((item) => {
      if (item.week === week) {
        return { ...item, IsChecked: !item.IsChecked };
      }
      return item;
    });

    setSavingsPlan(updatePlan);
    localStorage.setItem('savingsPlan', JSON.stringify(updatePlan)); // Save to local storage


    // Update the backend
    const selectedItem = updatePlan.find((item) => item.week === week);
    axios
      .put(`http://localhost:5179/api/SavingsPlan/${week}`, {
        IsChecked: selectedItem.IsChecked,
      })
      .then((response) => {
        console.log("Updated Successfully");
      })
      .catch((error) => {
        console.log("Error Updating data: ", error);
      });
  };

  return (
    <div className="container">
      <header className="header">
        <h1>SavingsPlan</h1>
      </header>

      <div className="savings-plan-grid">
        {savingsPlan.map((item) => (
          <div key={item.week} className="savings-card">
            <div className="savings-card-content">
              <div className="week-info">Week {item.week}</div>
              <div className="deposit-info">Deposit: {item.deposit}</div>
              <div className="balance-info">Balance: {item.balance}</div>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={item.IsChecked}
                  onChange={() => handleCheckboxChange(item.week)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="footer">
        <p>Start Saving and Tracking Today!</p>
        <div className="contact-info">
          <p>With As Low As Ksh 50</p>
          <p>Happy Saving!</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
