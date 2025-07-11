import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {

  const navigate = useNavigate();
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500"
        >
           Create New Problem
        </motion.h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/** Basic Info Section */}
          <section className="glass-effect p-6 rounded-xl shadow-lg border border-purple-500/30">
            <h2 className="text-2xl font-semibold mb-5 text-purple-300">Basic Information</h2>
            <div className="space-y-5">
              <input {...register('title')} placeholder="Enter problem title" className="input input-bordered w-full bg-gray-800 border-purple-500 text-white placeholder-gray-400" />
              {errors.title && <p className="text-sm text-red-400">{errors.title.message}</p>}

              <textarea {...register('description')} placeholder="Describe the problem..." className="textarea textarea-bordered w-full bg-gray-800 border-purple-500 text-white placeholder-gray-400" rows={5} />
              {errors.description && <p className="text-sm text-red-400">{errors.description.message}</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select {...register('difficulty')} className="select select-bordered bg-gray-800 border-purple-500 text-white">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <select {...register('tags')} className="select select-bordered bg-gray-800 border-purple-500 text-white">
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </section>

          {/** Visible Test Cases */}
          <section className="glass-effect p-6 rounded-xl shadow-lg border border-purple-500/30">
            <h2 className="text-2xl font-semibold mb-5 text-purple-300"> Visible Test Cases</h2>
            <div className="space-y-4">
              {visibleFields.map((field, index) => (
                <div key={field.id} className="bg-gray-900 p-4 rounded-lg border border-blue-400/30">
                  <input {...register(`visibleTestCases.${index}.input`)} placeholder="Input" className="input input-sm w-full mb-2 bg-gray-800 text-white" />
                  <input {...register(`visibleTestCases.${index}.output`)} placeholder="Output" className="input input-sm w-full mb-2 bg-gray-800 text-white" />
                  <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation" className="textarea w-full bg-gray-800 text-white" rows={2} />
                  <div className="text-right mt-2">
                    <button type="button" onClick={() => removeVisible(index)} className="btn btn-xs btn-error">Remove</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="btn btn-sm bg-blue-500 text-white hover:bg-blue-400">+ Add Visible Case</button>
            </div>
          </section>

          {/** Hidden Test Cases */}
          <section className="glass-effect p-6 rounded-xl shadow-lg border border-purple-500/30">
            <h2 className="text-2xl font-semibold mb-5 text-purple-300"> Hidden Test Cases</h2>
            <div className="space-y-4">
              {hiddenFields.map((field, index) => (
                <div key={field.id} className="bg-gray-900 p-4 rounded-lg border border-blue-400/30">
                  <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" className="input input-sm w-full mb-2 bg-gray-800 text-white" />
                  <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Output" className="input input-sm w-full bg-gray-800 text-white" />
                  <div className="text-right mt-2">
                    <button type="button" onClick={() => removeHidden(index)} className="btn btn-xs btn-error">Remove</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="btn btn-sm bg-blue-500 text-white hover:bg-blue-400">+ Add Hidden Case</button>
            </div>
          </section>

          {/** Code Templates */}
          <section className="glass-effect p-6 rounded-xl shadow-lg border border-purple-500/30">
            <h2 className="text-2xl font-semibold mb-5 text-purple-300"> Code Templates</h2>
            <div className="space-y-8">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-semibold text-blue-300 text-lg">
                    {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                  </h3>
                  <textarea {...register(`startCode.${index}.initialCode`)} className="textarea w-full bg-gray-800 text-white font-mono" rows={5} placeholder="Starter Code..." />
                  <textarea {...register(`referenceSolution.${index}.completeCode`)} className="textarea w-full bg-gray-800 text-white font-mono" rows={5} placeholder="Reference Solution..." />
                </div>
              ))}
            </div>
          </section>

          <motion.button type="submit" className="btn w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-bold py-3 rounded-xl shadow-xl mt-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
             Create Problem
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default AdminPanel;




