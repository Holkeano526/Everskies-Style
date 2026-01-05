
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import { generateEverskiesStyle } from './services/geminiService';
import { GenerationState, UserInput } from './types';

const LOADING_MESSAGES = [
  "Capturing pixel essence...",
  "Applying Everskies proportions...",
  "Stitching the outfit details...",
  "Polishing character features...",
  "Refining pixel shading...",
  "Almost there, finalizing layers..."
];

function App() {
  const [input, setInput] = useState<UserInput>({
    image: null,
    previewUrl: null,
    base64: null
  });

  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    resultImage: null,
    loadingMessage: LOADING_MESSAGES[0]
  });

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      setInput({
        image: file,
        previewUrl: URL.createObjectURL(file),
        base64: base64
      });
      // Reset result when new image is picked
      setState(prev => ({ ...prev, resultImage: null, error: null }));
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!input.base64 || !input.image) return;

    setState(prev => ({ 
      ...prev, 
      isGenerating: true, 
      error: null, 
      loadingMessage: LOADING_MESSAGES[0] 
    }));

    // Rotate loading messages
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setState(prev => ({ ...prev, loadingMessage: LOADING_MESSAGES[msgIndex] }));
    }, 2500);

    try {
      const resultUrl = await generateEverskiesStyle(input.base64, input.image.type);
      setState(prev => ({ 
        ...prev, 
        resultImage: resultUrl, 
        isGenerating: false 
      }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        error: "Failed to generate image. Please try again.", 
        isGenerating: false 
      }));
    } finally {
      clearInterval(interval);
    }
  };

  const handleDownload = () => {
    if (!state.resultImage) return;
    const link = document.createElement('a');
    link.href = state.resultImage;
    link.download = `everskies-character-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Everskies Style Converter
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload any character illustration and watch it transform into a pixel masterpiece 
            following the signature Everskies aesthetic.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input Side */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm">Upload Reference</h3>
              </div>
              
              <ImageUploader 
                onImageSelect={handleImageSelect} 
                previewUrl={input.previewUrl} 
                disabled={state.isGenerating}
              />

              <div className="mt-6 flex flex-col space-y-3">
                <button
                  onClick={handleGenerate}
                  disabled={!input.base64 || state.isGenerating}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 transition-all duration-300 ${
                    !input.base64 || state.isGenerating
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-1'
                  }`}
                >
                  {state.isGenerating ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin"></i>
                      <span>Generating Art...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-wand-magic-sparkles"></i>
                      <span>Generate Pixel Doll</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
                  Powered by Gemini 2.5 Flash
                </p>
              </div>
            </div>

            {state.error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center space-x-3 text-red-600">
                <i className="fas fa-exclamation-circle text-xl"></i>
                <span className="font-medium">{state.error}</span>
              </div>
            )}
          </div>

          {/* Output Side */}
          <div className="space-y-6 sticky top-24">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm">Result Preview</h3>
                </div>
                {state.resultImage && (
                  <button 
                    onClick={handleDownload}
                    className="text-indigo-600 hover:text-indigo-800 font-bold text-sm flex items-center space-x-1"
                  >
                    <i className="fas fa-download"></i>
                    <span>Save Image</span>
                  </button>
                )}
              </div>

              <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 relative overflow-hidden">
                {state.isGenerating ? (
                  <div className="flex flex-col items-center justify-center p-8 space-y-6 w-full">
                    <div className="relative w-24 h-24">
                       <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                       <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-indigo-600 font-bold text-lg animate-pulse">{state.loadingMessage}</p>
                      <p className="text-gray-400 text-sm mt-2">Creating pixel-perfect details</p>
                    </div>
                  </div>
                ) : state.resultImage ? (
                  <div className="p-4 w-full h-full flex items-center justify-center">
                    <img 
                      src={state.resultImage} 
                      alt="Generated pixel art" 
                      className="max-h-full max-w-full rounded-lg shadow-xl border-4 border-white pixel-border transition-all duration-500 scale-100 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="text-center p-12 opacity-30 select-none">
                    <i className="fas fa-images text-6xl text-gray-400 mb-4"></i>
                    <p className="font-medium text-gray-500">Your pixel art will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
               <h4 className="font-bold text-lg mb-3 flex items-center space-x-2">
                 <i className="fas fa-lightbulb text-yellow-400"></i>
                 <span>Style Guide</span>
               </h4>
               <ul className="space-y-2 text-indigo-100 text-sm">
                 <li className="flex items-start space-x-2">
                   <span className="text-indigo-400 mt-1">•</span>
                   <span><b>Body Shape:</b> Emphasizes tall, thin proportions unique to Everskies bases.</span>
                 </li>
                 <li className="flex items-start space-x-2">
                   <span className="text-indigo-400 mt-1">•</span>
                   <span><b>Faces:</b> Focuses on soft, glossy eyes and delicate features.</span>
                 </li>
                 <li className="flex items-start space-x-2">
                   <span className="text-indigo-400 mt-1">•</span>
                   <span><b>Items:</b> Hair and clothes are rendered with crisp pixel outlines and smooth shading.</span>
                 </li>
               </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2024 PixelEverskies Studio. Not affiliated with Everskies.com.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">API Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
