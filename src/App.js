import React from 'react';
import './app.styles.scss';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const App = () => {
    const [inputValue, setInputValue] = React.useState('');

    const handleChange = event => {
        setInputValue(event.target.value);
    };

    const fetchPost = async () => {
        await getDocs(collection(db, 'tests')).then(querySnapshot => {
            const newData = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            console.log(newData);
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const docRef = await addDoc(collection(db, 'tests'), {
                todo: inputValue
            });
            console.log('Document written with ID: ', docRef.id);
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    };
    return (
        <div className={'wrapper'}>
            <div className="app-container">
                <input value={inputValue} onChange={handleChange}></input>
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={fetchPost}>Get data</button>
            </div>
        </div>
    );
};
export default App;
