import React, { useState, useEffect } from 'react';
import { Save, Key, Moon, Sliders, Database, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ValidationResult {
    valid: boolean;
    message: string;
}

const Settings: React.FC = () => {
    const [apiKeys, setApiKeys] = useState({
        landingAi: '',
        gemini: '',
        deepSeek: ''
    });

    const [keyStatus, setKeyStatus] = useState({
        gemini: false,
        deepseek: false,
        landingai: false
    });

    const [validationResults, setValidationResults] = useState<{
        gemini?: ValidationResult;
        deepseek?: ValidationResult;
        landingai?: ValidationResult;
    }>({});

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [simulationDefaults, setSimulationDefaults] = useState({
        iterations: 10000,
        discountRate: 10
    });

    const [darkMode, setDarkMode] = useState(true);

    // Load key status on mount
    useEffect(() => {
        loadKeyStatus();
    }, []);

    const loadKeyStatus = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/settings/keys/status`);
            setKeyStatus(response.data);
        } catch (error) {
            console.error('Failed to load key status:', error);
        }
    };

    const handleSaveKeys = async () => {
        setIsSaving(true);
        setSaveMessage(null);
        setValidationResults({});

        try {
            // Step 1: Validate keys first
            const validateResponse = await axios.post(`${API_URL}/api/settings/keys/validate`, {
                gemini_api_key: apiKeys.gemini || undefined,
                deepseek_api_key: apiKeys.deepSeek || undefined,
                landingai_api_key: apiKeys.landingAi || undefined
            });

            setValidationResults(validateResponse.data);

            // Check if any provided keys failed validation
            const results = validateResponse.data;
            const hasInvalidKey =
                (apiKeys.gemini && !results.gemini?.valid) ||
                (apiKeys.deepSeek && !results.deepseek?.valid) ||
                (apiKeys.landingAi && !results.landingai?.valid);

            if (hasInvalidKey) {
                setSaveMessage({ type: 'error', text: 'Some API keys are invalid. Please check and try again.' });
                setIsSaving(false);
                return;
            }

            // Step 2: Save keys if validation passed
            const saveResponse = await axios.post(`${API_URL}/api/settings/keys`, {
                gemini_api_key: apiKeys.gemini || undefined,
                deepseek_api_key: apiKeys.deepSeek || undefined,
                landingai_api_key: apiKeys.landingAi || undefined
            });

            setKeyStatus(saveResponse.data);
            setSaveMessage({ type: 'success', text: '✓ API keys validated and saved! They will be used by the program.' });

            // Clear the input fields after saving
            setApiKeys({ landingAi: '', gemini: '', deepSeek: '' });
        } catch (error) {
            setSaveMessage({ type: 'error', text: 'Failed to save API keys. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleValidateKeys = async () => {
        setIsLoading(true);
        setValidationResults({});

        try {
            const response = await axios.post(`${API_URL}/api/settings/keys/validate`, {
                gemini_api_key: apiKeys.gemini || undefined,
                deepseek_api_key: apiKeys.deepSeek || undefined,
                landingai_api_key: apiKeys.landingAi || undefined
            });

            setValidationResults(response.data);

            // Show summary message
            const results = response.data;
            const allValid =
                (!apiKeys.gemini || results.gemini?.valid) &&
                (!apiKeys.deepSeek || results.deepseek?.valid) &&
                (!apiKeys.landingAi || results.landingai?.valid);

            if (allValid && (apiKeys.gemini || apiKeys.deepSeek || apiKeys.landingAi)) {
                setSaveMessage({ type: 'success', text: '✓ All provided keys are valid! Click Save to use them.' });
            }
        } catch (error) {
            console.error('Validation failed:', error);
            setSaveMessage({ type: 'error', text: 'Validation request failed. Please check your connection.' });
        } finally {
            setIsLoading(false);
        }
    };

    const renderValidationStatus = (key: 'gemini' | 'deepseek' | 'landingai') => {
        const result = validationResults[key];
        if (!result) return null;

        return (
            <div className={`flex items-center gap-1.5 mt-1 text-xs ${result.valid ? 'text-green-400' : 'text-red-400'}`}>
                {result.valid ? <CheckCircle size={12} /> : <XCircle size={12} />}
                <span>{result.message}</span>
            </div>
        );
    };

    const renderKeyStatus = (configured: boolean) => (
        <span className={`text-xs px-2 py-0.5 rounded-full ${configured ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
            {configured ? 'Configured' : 'Not set'}
        </span>
    );

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-2xl font-semibold mb-1">Settings</h1>
                <p className="text-gray-400">Configure API keys, preferences, and application settings</p>
            </div>

            {/* API Configuration */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Key size={20} className="text-gray-400" />
                    <h2 className="text-lg font-medium">API Configuration</h2>
                </div>
                <p className="text-sm text-gray-400 mb-6">Configure API keys for AI services. Keys are stored securely on the server.</p>

                {saveMessage && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${saveMessage.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-900/50' : 'bg-red-900/20 text-red-400 border border-red-900/50'}`}>
                        {saveMessage.text}
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium">Landing AI API Key</label>
                            {renderKeyStatus(keyStatus.landingai)}
                        </div>
                        <input
                            type="password"
                            placeholder="Enter your Landing AI API key"
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600 transition-colors"
                            value={apiKeys.landingAi}
                            onChange={(e) => setApiKeys({ ...apiKeys, landingAi: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1.5">Used for PDF extraction and OCR processing</p>
                        {renderValidationStatus('landingai')}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium">Gemini API Key</label>
                            {renderKeyStatus(keyStatus.gemini)}
                        </div>
                        <input
                            type="password"
                            placeholder="Enter your Gemini API key"
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600 transition-colors"
                            value={apiKeys.gemini}
                            onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1.5">Powers the Optimist AI agent in debates</p>
                        {renderValidationStatus('gemini')}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium">DeepSeek API Key</label>
                            {renderKeyStatus(keyStatus.deepseek)}
                        </div>
                        <input
                            type="password"
                            placeholder="Enter your DeepSeek API key"
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600 transition-colors"
                            value={apiKeys.deepSeek}
                            onChange={(e) => setApiKeys({ ...apiKeys, deepSeek: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1.5">Powers the Critic AI agent in debates</p>
                        {renderValidationStatus('deepseek')}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleValidateKeys}
                            disabled={isLoading || (!apiKeys.gemini && !apiKeys.deepSeek && !apiKeys.landingAi)}
                            className="flex-1 bg-gray-800 text-gray-300 font-medium py-2.5 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                            <span>Validate Keys</span>
                        </button>
                        <button
                            onClick={handleSaveKeys}
                            disabled={isSaving || (!apiKeys.gemini && !apiKeys.deepSeek && !apiKeys.landingAi)}
                            className="flex-1 bg-white text-gray-950 font-medium py-2.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>Save API Keys</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Appearance */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Moon size={20} className="text-gray-400" />
                    <h2 className="text-lg font-medium">Appearance</h2>
                </div>
                <p className="text-sm text-gray-400 mb-6">Customize the look and feel of the application</p>

                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium">Dark Mode</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Toggle between light and dark theme</p>
                    </div>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-white' : 'bg-gray-700'}`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-gray-950 absolute top-1 transition-transform ${darkMode ? 'left-6' : 'left-1'}`} />
                    </button>
                </div>
            </div>

            {/* Simulation Defaults */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Sliders size={20} className="text-gray-400" />
                    <h2 className="text-lg font-medium">Simulation Defaults</h2>
                </div>
                <p className="text-sm text-gray-400 mb-6">Set default parameters for Monte Carlo simulations</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Iterations</label>
                        <input
                            type="number"
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600 transition-colors"
                            value={simulationDefaults.iterations}
                            onChange={(e) => setSimulationDefaults({ ...simulationDefaults, iterations: parseInt(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Default Discount Rate (%)</label>
                        <input
                            type="number"
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600 transition-colors"
                            value={simulationDefaults.discountRate}
                            onChange={(e) => setSimulationDefaults({ ...simulationDefaults, discountRate: parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                <button className="w-full bg-gray-800 text-gray-300 font-medium py-2.5 rounded-lg hover:bg-gray-700 transition-colors">
                    Reset to Defaults
                </button>
            </div>

            {/* Data Management */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Database size={20} className="text-gray-400" />
                    <h2 className="text-lg font-medium">Data Management</h2>
                </div>
                <p className="text-sm text-gray-400 mb-6">Manage your local data and analysis history</p>

                <div className="space-y-3">
                    <button className="w-full bg-gray-800 text-gray-300 font-medium py-2.5 rounded-lg hover:bg-gray-700 transition-colors">
                        Clear Analysis History
                    </button>
                    <button className="w-full bg-red-900/20 text-red-400 border border-red-900/50 font-medium py-2.5 rounded-lg hover:bg-red-900/30 transition-colors">
                        Clear All Data & Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
