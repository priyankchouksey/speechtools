import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpeechRecognitionService } from './speech.service';

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
  speechSynthesis: any;
  SpeechSynthesisUtterance: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {


  isListining: boolean = false;
  speechRecognition:any;
  speechSynthesis:any;
  speechUtterance:any;
  voices:any;
  recognizedText: string='';
  speechText: string='';
  showSettings:boolean=false;
  transOptions:Array<any> = [{index:0, name:'None'},{index:1, name:'Reverse by char'}, {index:2, name:'Reverse by words'}];
  transSelected: number=2;
  speechConfig:any = {voiceIndex: 0, rate: 1, pitch: 1, volume: 1};

  constructor(private speechRecognitionService: SpeechRecognitionService){

  }
  ngOnInit(): void {
    let _self = this;
    const {webkitSpeechRecognition}: IWindow = <IWindow>window;
    const {speechSynthesis}: IWindow= <IWindow>window;
    const {SpeechSynthesisUtterance}: IWindow=<IWindow>window;

    this.speechSynthesis = speechSynthesis;
    this.speechUtterance = new SpeechSynthesisUtterance();
    this.speechUtterance.onerror = this.onSpeachError; 
    
    this.speechRecognition = new webkitSpeechRecognition();
    this.speechRecognition.continuous = true;
    //this.speechRecognition.onend = this.toggleStartStop();
    this.recognizedText = '';
    this.speechRecognition.onresult = function(event){
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          _self.textareaModelChange(event.results[i][0].transcript);
        }
      }
    };
    
    setTimeout(function(){
      _self.voices = this.speechSynthesis.getVoices();
    },5)
    //load default speechconfig
  }
  ngOnDestroy(): void {
    this.speechRecognitionService.DestroySpeechObject();
  }
  getSpeechText(){
    switch (this.transSelected) {
      case 0:
        this.speechText = this.recognizedText;
        break;
      case 1:
        this.speechText = this.recognizedText.split("").reverse().join("");
        break;
      case 2:
        this.speechText = this.recognizedText.split(" ").reverse().join(" ");    
        break;
      default:
        break;
    }
    return this.speechText;
  }
  toggleStartStop() {
    if (this.isListining) {
      this.speechRecognition.stop();
      this.isListining = false;      
    } else {
      this.recognizedText = '';
      this.speechRecognition.start();
      this.isListining = true;
    }
  }
  testVoice(){
    this.speak();
   }
  doSpeak(){
    this.speak(this.speechText);
  }
  speak(text?: string){
    var selectedVoice: any = this.voices[this.speechConfig.voiceIndex];
    this.speechUtterance.voice = selectedVoice;
    this.speechUtterance.volume = this.speechConfig.volume;
    this.speechUtterance.rate = this.speechConfig.rate;
    this.speechUtterance.pitch = this.speechConfig.pitch;
    this.speechUtterance.text = text == null? "Hi, I am " + selectedVoice.name + " and my language is " + selectedVoice.lang : text;  
    this.speechSynthesis.speak(this.speechUtterance);
  }
  onSpeachError(error){
    console.log(error);
  }
  textareaModelChange(event){
    //let data = event;
    this.recognizedText = event;
    this.getSpeechText();
  }
  transModelChange(event){
    this.transSelected = +event;
    this.getSpeechText();
  }
}
