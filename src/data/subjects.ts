import { SubjectInfo } from '../types';

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'programming',
    name: 'Programming & Coding',
    tamilName: 'நிரலாக்கம் & கோடிங்',
    iconName: 'Code',
    description: 'Master Python, Java, C++, JavaScript, Object-Oriented Design, and Algorithms.',
    color: 'from-blue-600 to-indigo-600',
    bgLight: 'bg-blue-50 text-blue-700 border-blue-200',
    topics: [
      'Python Basics & Data Structures',
      'Object Oriented Programming (OOP)',
      'Recursion & Dynamic Programming',
      'Asynchronous JavaScript & Promises',
      'C++ Pointers & Memory Management',
      'Database Queries & SQL',
    ],
    sampleQuestions: [
      'Explain the difference between Pass by Value and Pass by Reference with code examples.',
      'How does Python handle memory management and Garbage Collection?',
      'Explain Object-Oriented Principles (Polymorphism & Encapsulation) with a real-life analogy.',
      'What is Big-O notation, and how do I calculate the time complexity of a recursive function?',
    ],
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence & ML',
    tamilName: 'செயற்கை நுண்ணறிவு & இயந்திர கற்றல்',
    iconName: 'Cpu',
    description: 'Neural networks, Deep Learning, Supervised Learning, Transformers, and LLMs.',
    color: 'from-purple-600 to-pink-600',
    bgLight: 'bg-purple-50 text-purple-700 border-purple-200',
    topics: [
      'Neural Networks & Backpropagation',
      'Gradient Descent & Optimizers (Adam, SGD)',
      'Convolutional Neural Networks (CNN)',
      'Natural Language Processing & Transformers',
      'Supervised vs Unsupervised Learning',
      'Overfitting, Regularization & Dropout',
    ],
    sampleQuestions: [
      'How does Backpropagation calculate gradients in a Multi-Layer Perceptron?',
      'Explain the difference between Precision, Recall, and F1-Score using a medical diagnosis example.',
      'How do Self-Attention and Transformers work under the hood?',
      'What is the Vanishing Gradient problem and how do ReLU or ResNets fix it?',
    ],
  },
  {
    id: 'mathematics',
    name: 'Mathematics & Calculus',
    tamilName: 'கணிதம் & நுண்கணிதம்',
    iconName: 'Sigma',
    description: 'Derivatives, Integrals, Linear Algebra, Probability, Eigenvalues & Discrete Math.',
    color: 'from-emerald-600 to-teal-600',
    bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    topics: [
      'Calculus: Limits, Derivatives & Integrals',
      'Linear Algebra: Matrices & Eigenvectors',
      'Probability Distributions (Normal, Binomial)',
      'Differential Equations & Modeling',
      'Discrete Mathematics & Graph Theory',
      'Fourier Transforms & Signal Analysis',
    ],
    sampleQuestions: [
      'Solve and explain step-by-step: How to evaluate the integral ∫ x * e^(2x) dx using Integration by Parts.',
      'What are Eigenvalues and Eigenvectors visually, and why are they vital in Data Science / PCA?',
      'Explain Bayes Theorem with an intuitive step-by-step real-world example.',
      'How do I find local maxima and minima using the Second Derivative Test?',
    ],
  },
  {
    id: 'cs',
    name: 'Computer Science Core',
    tamilName: 'கணினி அறிவியல் கோர்',
    iconName: 'Terminal',
    description: 'Operating Systems, Computer Networks, DBMS, Compilers, and System Architecture.',
    color: 'from-amber-600 to-orange-600',
    bgLight: 'bg-amber-50 text-amber-700 border-amber-200',
    topics: [
      'Operating Systems: CPU Scheduling & Deadlocks',
      'Computer Networks: TCP/IP vs OSI model',
      'DBMS: ACID Properties & Normalization (1NF to BCNF)',
      'Memory Management: Paging & Virtual Memory',
      'Computer Organization: Pipeline & Caching',
      'Network Security: Cryptography & SSL/TLS',
    ],
    sampleQuestions: [
      'Explain the four conditions necessary for Deadlock and Banker\'s algorithm.',
      'Compare TCP and UDP: Why would a game stream use UDP while banking uses TCP?',
      'Walk through Database Normalization from 1NF to 3NF with a student registration table.',
      'How does Virtual Memory translate logical addresses to physical addresses using Page Tables?',
    ],
  },
  {
    id: 'english',
    name: 'English & Academic Writing',
    tamilName: 'ஆங்கிலம் & கல்வி எழுத்து',
    iconName: 'BookOpen',
    description: 'Grammar mastery, research paper structuring, essay composition, and presentation skills.',
    color: 'from-rose-600 to-red-600',
    bgLight: 'bg-rose-50 text-rose-700 border-rose-200',
    topics: [
      'Academic Essay & Thesis Formulation',
      'Grammar & Sentence Syntax Mastery',
      'Literature Review & Citation Styles (APA/IEEE)',
      'Professional Email & Presentation Skills',
      'Vocabulary Expansion & Tone Control',
      'Critical Analysis & Debate Argumentation',
    ],
    sampleQuestions: [
      'How do I write a compelling Abstract and Problem Statement for a college research paper?',
      'Explain Active vs. Passive voice and when passive voice is preferred in scientific papers.',
      'Provide 5 academic phrases to replace colloquial expressions in research papers.',
      'How to structure an argument using the Claim-Evidence-Reasoning (CER) framework?',
    ],
  },
  {
    id: 'physics',
    name: 'Physics & Engineering',
    tamilName: 'இயற்பியல் & பொறியியல்',
    iconName: 'Atom',
    description: 'Electromagnetism, Mechanics, Thermodynamics, Optics, and Quantum Physics.',
    color: 'from-cyan-600 to-blue-600',
    bgLight: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    topics: [
      'Newtonian Mechanics & Kinematics',
      'Thermodynamics: Entropy & Heat Engines',
      'Electromagnetism: Maxwell’s Equations',
      'Wave Optics: Interference & Diffraction',
      'Quantum Mechanics: Photoelectric Effect',
      'Semiconductor Physics & Diodes',
    ],
    sampleQuestions: [
      'Explain the Second Law of Thermodynamics and the concept of Entropy simply.',
      'Derive and explain the working of a Carnot Heat Engine with efficiency formula.',
      'What is the Photoelectric Effect and how did Einstein’s photon hypothesis explain it?',
      'Explain Gauss’s Law and how to calculate the electric field of an infinite sheet of charge.',
    ],
  },
];

export const SAMPLE_NOTES = [
  {
    id: 'notes-calculus',
    title: 'Calculus: Integration by Parts & Chain Rule',
    subject: 'Mathematics',
    description: 'Handwritten mathematical formulas, integral derivation, and substitution steps.',
    query: 'Transcribe this formula, explain why the constant C is added, and solve a similar practice problem.',
  },
  {
    id: 'notes-tree',
    title: 'Data Structures: AVL Tree Rotation',
    subject: 'Computer Science',
    description: 'Binary Search Tree balance factors, Left-Right rotation diagrams and time complexities.',
    query: 'Explain how the balance factor is computed and why tree balancing guarantees O(log N) operations.',
  },
  {
    id: 'notes-circuits',
    title: 'Electrical Engineering: Kirchhoff’s Current & Voltage Laws',
    subject: 'Physics & Engineering',
    description: 'Circuit loop diagrams with resistors, voltage drops, and node equations.',
    query: 'Explain the difference between KCL and KVL, and check if the node current equation in the notes is balanced.',
  },
];

export const SAMPLE_STUDY_MATERIALS = [
  {
    title: 'Operating Systems - Process Scheduling & CPU Scheduling Algorithms',
    subject: 'Computer Science',
    content: `Process scheduling is an essential part of a Multiprogramming Operating System. Such operating systems allow more than one process to be loaded into the executable memory at a time and the loaded processes share the CPU using time multiplexing.

Objectives of CPU Scheduling:
1. Maximize CPU utilization: Keep CPU as busy as possible (ideally 40% to 90%).
2. Maximize Throughput: Number of processes that complete their execution per time unit.
3. Minimize Turnaround Time: Amount of time to execute a particular process from submission to completion.
4. Minimize Waiting Time: Amount of time a process has been waiting in the ready queue.
5. Minimize Response Time: Amount of time it takes from when a request was submitted until the first response is produced.

Key Algorithms:
- First-Come, First-Served (FCFS): Simplest scheduling algorithm. Non-preemptive. Suffers from the "Convoy Effect" where short processes wait behind long CPU-bound processes.
- Shortest-Job-Next (SJN) / Shortest Job First (SJF): Selects the waiting process with the smallest execution time. Provably optimal in terms of minimizing average waiting time. Difficult to know future CPU burst duration.
- Round Robin (RR): Preemptive scheduling designed specifically for time-sharing systems. Each process is assigned a fixed time slot called a "time quantum" (typically 10 to 100 milliseconds). If quantum is too large, it degrades into FCFS; if too small, context-switch overhead dominates.
- Priority Scheduling: CPU is allocated to the process with highest priority. A major problem is Starvation (indefinite blocking), which can be resolved via Aging (gradually increasing the priority of processes that wait in the system for a long time).`,
  },
  {
    title: 'Machine Learning - Supervised vs. Unsupervised Learning & Overfitting',
    subject: 'Artificial Intelligence & ML',
    content: `Machine Learning algorithms build a model based on training data in order to make predictions or decisions without being explicitly programmed to perform the task.

1. Supervised Learning:
The model is trained on labeled data, meaning both the input features (X) and the desired ground-truth labels (Y) are provided during training.
- Classification: Predicts discrete categorical labels (e.g., spam vs non-spam, disease diagnosis). Algorithms: Logistic Regression, Support Vector Machines (SVM), Random Forest, Neural Networks.
- Regression: Predicts continuous numerical values (e.g., house price, stock market value, temperature). Algorithms: Linear Regression, Polynomial Regression, Ridge/Lasso.

2. Unsupervised Learning:
The algorithm finds hidden patterns, groupings, or representations from unlabeled data.
- Clustering: Groups similar data points together without predefined categories. Algorithms: K-Means, DBSCAN, Hierarchical Clustering.
- Dimensionality Reduction: Compresses high-dimensional data into fewer features while preserving maximum variance. Algorithms: Principal Component Analysis (PCA), t-SNE.

3. The Bias-Variance Tradeoff & Overfitting:
- Underfitting (High Bias): The model is too simple to capture the underlying structure of the data. Performs poorly on both training and test sets.
- Overfitting (High Variance): The model memorizes training noise rather than generalizing. Performs excellently on training data, but poorly on unseen test data.
- Prevention Techniques: Cross-validation (k-fold), Regularization (L1 Lasso, L2 Ridge), Early Stopping, Dropout in Neural Networks, and gathering more training samples.`,
  },
];
