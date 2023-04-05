import React, {useState} from 'react'
import {Viewer , Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import styles from '../styles/pdf.module.scss';

function Pdf() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [pdfFile, setPdfFile]=useState(null);
  const[viewPdf, setViewPdf]=useState(null);
  const [pdfError, setPdfError]=useState('');
  const allowedFiles = ['application/pdf'];
  const handleFile = (e) =>{
    let selectedFile = e.target.files[0];
    if(selectedFile){
      if(selectedFile && allowedFiles.includes(selectedFile.type)){
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend=(e)=>{
          setPdfError('');
          setPdfFile(e.target.result);
        }
      }
      else{
        setPdfError('Not a valid pdf: Please select only PDF');
        setPdfFile(null);
      }
    }
    else{
      console.log('please select a PDF');
    }
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    if(pdfFile !== null){
      setViewPdf(pdfFile);
    }
    else{
      setViewPdf(null);
      console.log('please select a PDF');
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className={styles.form}>
        <label><h5>Upload PDF</h5></label>
        <br></br>
        <input type='file' className="form-control"
        onChange={handleFile}></input>
        {pdfError&&<span className='text-danger'>{pdfError}</span>}
      </form>
      <h5>View PDF</h5>
      <div className={styles.pdfContainer}>

        {pdfFile&&(
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.5.141/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfFile}
            plugins={[defaultLayoutPluginInstance]}></Viewer>
          </Worker>
        )}

        {/* render this if we have pdfFile state null   */}
        {!pdfFile&&<>No file is selected yet</>}

      </div>

    </div>
  );
}

export default Pdf;