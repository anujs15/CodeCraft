import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import { motion } from 'framer-motion';

const langMap = {
        cpp: 'C++',
        java: 'Java',
        javascript: 'JavaScript'
};


const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let {problemId}  = useParams();

  

  const { handleSubmit } = useForm();

 useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
       
        
        const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;

        setProblem(response.data);
        
        setCode(initialCode);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
      
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
        const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code:code,
        language: selectedLanguage
      });

       setSubmitResult(response.data);
       setLoading(false);
       setActiveRightTab('result');
      
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="loading loading-spinner loading-lg text-purple-400"></span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full flex-col lg:flex-row"
      >
        {/* Left Panel */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-purple-500/30">
          {/* Left Tabs */}
          <div className="tabs tabs-bordered glass-effect px-2 sm:px-4 overflow-x-auto">
            <button 
              className={`tab tab-xs sm:tab-md ${activeLeftTab === 'description' ? 'tab-active' : ''}`}
              onClick={() => setActiveLeftTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab tab-xs sm:tab-md ${activeLeftTab === 'editorial' ? 'tab-active' : ''}`}
              onClick={() => setActiveLeftTab('editorial')}
            >
              Editorial
            </button>
            <button 
              className={`tab tab-xs sm:tab-md ${activeLeftTab === 'solutions' ? 'tab-active' : ''}`}
              onClick={() => setActiveLeftTab('solutions')}
            >
              Solutions
            </button>
            <button 
              className={`tab tab-xs sm:tab-md ${activeLeftTab === 'submissions' ? 'tab-active' : ''}`}
              onClick={() => setActiveLeftTab('submissions')}
            >
              Submissions
            </button>
            <button 
              className={`tab tab-xs sm:tab-md ${activeLeftTab === 'chatAI' ? 'tab-active' : ''}`}
              onClick={() => setActiveLeftTab('chatAI')}
            >
              ChatAI
            </button>
          </div>

          {/* Left Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 glass-effect">
            {problem && (
              <>
                {activeLeftTab === 'description' && (
                  <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                      <h1 className="text-xl sm:text-2xl font-bold">{problem.title}</h1>
                      <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                      </div>
                      <div className="badge badge-primary">{problem.tags}</div>
                    </div>

                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {problem.description}
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Examples:</h3>
                      <div className="space-y-4">
                        {problem.visibleTestCases.map((example, index) => (
                          <div key={index} className="bg-base-200 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
                            <div className="space-y-2 text-sm font-mono">
                              <div><strong>Input:</strong> {example.input}</div>
                              <div><strong>Output:</strong> {example.output}</div>
                              <div><strong>Explanation:</strong> {example.explanation}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeLeftTab === 'editorial' && (
                  <div className="prose max-w-none">
                    <h2 className="text-xl font-bold mb-4">Editorial</h2>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}/>
                    </div>
                  </div>
                )}

                {activeLeftTab === 'solutions' && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Solutions</h2>
                    <div className="space-y-6">
                      {problem.referenceSolution?.map((solution, index) => (
                        <div key={index} className="border border-base-300 rounded-lg">
                          <div className="bg-base-200 px-4 py-2 rounded-t-lg">
                            <h3 className="font-semibold">{problem?.title} - {solution?.language}</h3>
                          </div>
                          <div className="p-4">
                            <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
                              <code>{solution?.completeCode}</code>
                            </pre>
                          </div>
                        </div>
                      )) || <p className="text-gray-500">Solutions will be available after you solve the problem.</p>}
                    </div>
                  </div>
                )}

                {activeLeftTab === 'submissions' && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">My Submissions</h2>
                    <div className="text-gray-500">
                      <SubmissionHistory problemId={problemId} />
                    </div>
                  </div>
                )}

                {activeLeftTab === 'chatAI' && (
                  <div className="prose max-w-none">
                    <h2 className="text-xl font-bold mb-4">CHAT with AI</h2>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      <ChatAi problem={problem}></ChatAi>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Right Tabs */}
          <div className="tabs tabs-bordered glass-effect px-2 sm:px-4 overflow-x-auto">
            <button 
              className={`tab tab-xs sm:tab-md ${activeRightTab === 'code' ? 'tab-active' : ''}`}
              onClick={() => setActiveRightTab('code')}
            >
              Code
            </button>
            <button 
              className={`tab tab-xs sm:tab-md ${activeRightTab === 'testcase' ? 'tab-active' : ''}`}
              onClick={() => setActiveRightTab('testcase')}
            >
              Testcase
            </button>
            <button 
              className={`tab tab-xs sm:tab-md ${activeRightTab === 'result' ? 'tab-active' : ''}`}
              onClick={() => setActiveRightTab('result')}
            >
              Result
            </button>
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col">
            {activeRightTab === 'code' && (
              <div className="flex-1 flex flex-col">
                {/* Language Selector */}
                <div className="flex justify-between items-center p-4 border-b border-purple-500/30 glass-effect">
                  <div className="flex gap-2">
                    {['javascript', 'java', 'cpp'].map((lang) => (
                      <motion.button
                        key={lang}
                        className={`btn btn-sm ${selectedLanguage === lang ? 'btn-gradient text-white' : 'btn-ghost'}`}
                        onClick={() => handleLanguageChange(lang)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 bg-gray-900/70 backdrop-blur-lg border-t border-purple-500/10">
                  <Editor
                    height="100%"
                    language={getLanguageForMonaco(selectedLanguage)}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      glyphMargin: false,
                      folding: true,
                      lineDecorationsWidth: 10,
                      lineNumbersMinChars: 3,
                      renderLineHighlight: 'line',
                      selectOnLineNumbers: true,
                      roundedSelection: false,
                      readOnly: false,
                      cursorStyle: 'line',
                      mouseWheelZoom: true,
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="p-2 sm:p-4 border-t border-purple-500/30 flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 glass-effect">
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-ghost btn-xs sm:btn-sm"
                      onClick={() => setActiveRightTab('testcase')}
                    >
                      Console
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      className={`btn btn-outline btn-xs sm:btn-sm ${loading ? 'loading' : ''}`}
                      onClick={handleRun}
                      disabled={loading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Run
                    </motion.button>
                    <motion.button
                      className={`btn btn-gradient btn-xs sm:btn-sm text-white ${loading ? 'loading' : ''}`}
                      onClick={handleSubmitCode}
                      disabled={loading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Submit
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {activeRightTab === 'testcase' && (
              <div className="flex-1 p-4 overflow-y-auto">
                <h3 className="font-semibold mb-4">Test Results</h3>
                {runResult ? (
                  <div className={`alert ${runResult.success ? 'alert-success' : 'alert-error'} mb-4`}>
                    <div>
                      {runResult.success ? (
                        <div>
                          <h4 className="font-bold">✅ All test cases passed!</h4>
                          <p className="text-sm mt-2">Runtime: {runResult.runtime+" sec"}</p>
                          <p className="text-sm">Memory: {runResult.memory+" KB"}</p>
                          
                          <div className="mt-4 space-y-2">
                            {runResult.testCases.map((tc, i) => (
                              <div key={i} className="bg-base-100 p-3 rounded text-xs">
                                <div className="font-mono">
                                  <div><strong>Input:</strong> {tc.stdin}</div>
                                  <div><strong>Expected:</strong> {tc.expected_output}</div>
                                  <div><strong>Output:</strong> {tc.stdout}</div>
                                  <div className={'text-green-600'}>
                                    {'✓ Passed'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-bold">❌ Error</h4>
                          <div className="mt-4 space-y-2">
                            {runResult.testCases.map((tc, i) => (
                              <div key={i} className="bg-base-100 p-3 rounded text-xs">
                                <div className="font-mono">
                                  <div><strong>Input:</strong> {tc.stdin}</div>
                                  <div><strong>Expected:</strong> {tc.expected_output}</div>
                                  <div><strong>Output:</strong> {tc.stdout}</div>
                                  <div className={tc.status_id==3 ? 'text-green-600' : 'text-red-600'}>
                                    {tc.status_id==3 ? '✓ Passed' : '✗ Failed'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Click "Run" to test your code with the example test cases.
                  </div>
                )}
              </div>
            )}

            {activeRightTab === 'result' && (
              <div className="flex-1 p-4 overflow-y-auto">
                <h3 className="font-semibold mb-4">Submission Result</h3>
                {submitResult ? (
                  <div className={`alert ${submitResult.accepted ? 'alert-success' : 'alert-error'}`}>
                    <div>
                      {submitResult.accepted ? (
                        <div>
                          <h4 className="font-bold text-lg">🎉 Accepted</h4>
                          <div className="mt-4 space-y-2">
                            <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                            <p>Runtime: {submitResult.runtime + " sec"}</p>
                            <p>Memory: {submitResult.memory + "KB"} </p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-bold text-lg">❌ {submitResult.error}</h4>
                          <div className="mt-4 space-y-2">
                            <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Click "Submit" to submit your solution for evaluation.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProblemPage;