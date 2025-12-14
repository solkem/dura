
import * as React from 'react';
import { useState } from 'react';

const KeyExchangeSimulator = () => {
    const [step, setStep] = useState(0);

    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const reset = () => setStep(0);

    return (
        <div className="my-8 p-6 bg-slate-900 rounded-xl border border-slate-700 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-slate-800/[0.2] pointer-events-none"></div>

            <div className="relative z-10">
                <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🔐</span> Ndani Key Exchange Protocol
                </h3>

                <div className="flex justify-between items-center mb-12 px-8">
                    {/* Device Node */}
                    <div className={`flex flex-col items-center transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-2 transition-all ${step === 3 ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-slate-800 border-2 border-slate-600'}`}>
                            📱
                        </div>
                        <span className="text-slate-300 font-mono text-sm">IoT Device</span>
                        {step >= 1 && (
                            <div className="mt-2 px-2 py-1 bg-cyan-900/50 border border-cyan-500/30 rounded text-xs font-mono text-cyan-300">
                                Share A
                            </div>
                        )}
                    </div>

                    {/* Connection Line */}
                    <div className="flex-1 mx-4 h-1 bg-slate-800 rounded relative overflow-hidden">
                        {step >= 2 && (
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-pulse"></div>
                        )}
                    </div>

                    {/* Farmer Node */}
                    <div className={`flex flex-col items-center transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-2 transition-all ${step === 3 ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-slate-800 border-2 border-slate-600'}`}>
                            👨‍🌾
                        </div>
                        <span className="text-slate-300 font-mono text-sm">Farmer</span>
                        {step >= 1 && (
                            <div className="mt-2 px-2 py-1 bg-purple-900/50 border border-purple-500/30 rounded text-xs font-mono text-purple-300">
                                Share B
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 mb-6 min-h-[100px] border border-slate-700">
                    <p className="text-slate-300 text-center font-medium">
                        {step === 0 && "Step 1: Initialize Trustless Environment"}
                        {step === 1 && "Step 2: Key Generation & Splitting (DKG)"}
                        {step === 2 && "Step 3: Multi-Party Computation (MPC) Request"}
                        {step === 3 && "Step 4: Transaction Signed (2-of-2 Signature)"}
                    </p>
                    <p className="text-slate-500 text-center text-sm mt-2">
                        {step === 0 && "Neither the device nor the farmer holds the full private key."}
                        {step === 1 && "The master key is mathematically split. Share A stays on hardware. Share B goes to the owner."}
                        {step === 2 && "To spend assets, both parties must cryptographically agree. No single point of failure."}
                        {step === 3 && "Success! The blockchain accepts the transaction without ever reconstructing the key."}
                    </p>
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={reset}
                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                        disabled={step === 0}
                    >
                        Reset
                    </button>
                    <button
                        onClick={nextStep}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={step === 3}
                    >
                        {step === 3 ? 'Completed' : 'Next Step →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KeyExchangeSimulator;
