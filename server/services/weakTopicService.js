/**
 * DevTrack Weak-Topic DSA Recommender Engine
 * Analyzes developer problem counts across core technical interview categories
 * and recommends targeted practice problems to bridge preparation gaps.
 */

const CORE_DSA_CATEGORIES = [
  {
    id: 'dp',
    name: 'Dynamic Programming',
    shortName: 'DP',
    target: 15,
    description: 'Crucial for MAANG/Tier-1 rounds. Covers 1D/2D memoization, knapsack, and state transitions.',
    leetcodeTags: ['Dynamic Programming', 'Memoization'],
    problems: [
      {
        id: 70,
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/climbing-stairs/',
        acceptance: '53.1%',
        concept: '1D DP / Fibonacci pattern',
      },
      {
        id: 322,
        title: 'Coin Change',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/coin-change/',
        acceptance: '44.2%',
        concept: 'Unbounded Knapsack / Minimum coins',
      },
      {
        id: 300,
        title: 'Longest Increasing Subsequence',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
        acceptance: '55.3%',
        concept: 'Subsequence DP / Patience sorting',
      },
      {
        id: 198,
        title: 'House Robber',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/house-robber/',
        acceptance: '51.4%',
        concept: 'Non-adjacent item selection',
      },
      {
        id: 139,
        title: 'Word Break',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/word-break/',
        acceptance: '46.8%',
        concept: 'String partitioning / Dictionary lookup',
      },
      {
        id: 72,
        title: 'Edit Distance',
        difficulty: 'Hard',
        url: 'https://leetcode.com/problems/edit-distance/',
        acceptance: '56.9%',
        concept: '2D Matrix DP / String transformation',
      },
    ],
  },
  {
    id: 'graphs',
    name: 'Graphs & BFS/DFS',
    shortName: 'Graphs',
    target: 15,
    description: 'Essential for modeling networks, dependencies, connectivity, and shortest path algorithms.',
    leetcodeTags: ['Graph', 'Breadth-First Search', 'Depth-First Search', 'Shortest Path', 'Topological Sort'],
    problems: [
      {
        id: 200,
        title: 'Number of Islands',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/number-of-islands/',
        acceptance: '59.2%',
        concept: 'Grid DFS / Connected components',
      },
      {
        id: 133,
        title: 'Clone Graph',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/clone-graph/',
        acceptance: '57.8%',
        concept: 'Hash map graph traversal',
      },
      {
        id: 207,
        title: 'Course Schedule',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/course-schedule/',
        acceptance: '48.1%',
        concept: 'Cycle detection / Topological sort',
      },
      {
        id: 417,
        title: 'Pacific Atlantic Water Flow',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/',
        acceptance: '56.4%',
        concept: 'Multi-source flood fill BFS',
      },
      {
        id: 127,
        title: 'Word Ladder',
        difficulty: 'Hard',
        url: 'https://leetcode.com/problems/word-ladder/',
        acceptance: '39.4%',
        concept: 'Shortest path BFS with word transformations',
      },
    ],
  },
  {
    id: 'trees',
    name: 'Trees & Binary Search Trees',
    shortName: 'Trees',
    target: 15,
    description: 'Fundamental tree traversals, BST properties, recursion depth, and tree serialization.',
    leetcodeTags: ['Tree', 'Binary Tree', 'Binary Search Tree'],
    problems: [
      {
        id: 226,
        title: 'Invert Binary Tree',
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/invert-binary-tree/',
        acceptance: '77.5%',
        concept: 'Recursive tree mirroring',
      },
      {
        id: 104,
        title: 'Maximum Depth of Binary Tree',
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
        acceptance: '76.2%',
        concept: 'Post-order traversal depth',
      },
      {
        id: 235,
        title: 'Lowest Common Ancestor of a BST',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
        acceptance: '65.2%',
        concept: 'BST split point property',
      },
      {
        id: 102,
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
        acceptance: '67.9%',
        concept: 'Queue-based BFS level grouping',
      },
      {
        id: 98,
        title: 'Validate Binary Search Tree',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/validate-binary-search-tree/',
        acceptance: '33.5%',
        concept: 'Inorder sorted check / Bounds propagation',
      },
      {
        id: 124,
        title: 'Binary Tree Maximum Path Sum',
        difficulty: 'Hard',
        url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
        acceptance: '40.2%',
        concept: 'Post-order maximum branch contribution',
      },
    ],
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window & Two Pointers',
    shortName: 'Window / 2P',
    target: 15,
    description: 'High-frequency pattern in tech screens for linear optimization, subarrays, and strings.',
    leetcodeTags: ['Sliding Window', 'Two Pointers'],
    problems: [
      {
        id: 121,
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        acceptance: '54.8%',
        concept: 'Single pass running minimum',
      },
      {
        id: 3,
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        acceptance: '35.6%',
        concept: 'Dynamic window expansion & contraction',
      },
      {
        id: 15,
        title: '3Sum',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/3sum/',
        acceptance: '35.4%',
        concept: 'Sorted array two-pointer sandwich',
      },
      {
        id: 11,
        title: 'Container With Most Water',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/container-with-most-water/',
        acceptance: '55.9%',
        concept: 'Greedy inwards pointer shifting',
      },
      {
        id: 76,
        title: 'Minimum Window Substring',
        difficulty: 'Hard',
        url: 'https://leetcode.com/problems/minimum-window-substring/',
        acceptance: '43.2%',
        concept: 'Frequency map target matching window',
      },
    ],
  },
  {
    id: 'heaps',
    name: 'Heaps & Priority Queues',
    shortName: 'Heaps',
    target: 12,
    description: 'Top-K elements, streaming data, intervals, and greedy priority dispatching.',
    leetcodeTags: ['Heap (Priority Queue)'],
    problems: [
      {
        id: 215,
        title: 'Kth Largest Element in an Array',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
        acceptance: '67.2%',
        concept: 'Min-heap of size K or QuickSelect',
      },
      {
        id: 347,
        title: 'Top K Frequent Elements',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/top-k-frequent-elements/',
        acceptance: '63.9%',
        concept: 'Bucket sort or Max-heap frequency count',
      },
      {
        id: 23,
        title: 'Merge k Sorted Lists',
        difficulty: 'Hard',
        url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
        acceptance: '53.8%',
        concept: 'Priority queue multi-way merge',
      },
      {
        id: 295,
        title: 'Find Median from Data Stream',
        difficulty: 'Hard',
        url: 'https://leetcode.com/problems/find-median-from-data-stream/',
        acceptance: '52.5%',
        concept: 'Two balancing heaps (max-heap + min-heap)',
      },
    ],
  },
  {
    id: 'backtracking',
    name: 'Backtracking & Recursion',
    shortName: 'Backtracking',
    target: 12,
    description: 'Combinatorial searches, permutations, constraint satisfaction, and pruning trees.',
    leetcodeTags: ['Backtracking', 'Recursion'],
    problems: [
      {
        id: 78,
        title: 'Subsets',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/subsets/',
        acceptance: '78.5%',
        concept: 'Power set generation / Include-exclude state',
      },
      {
        id: 46,
        title: 'Permutations',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/permutations/',
        acceptance: '79.1%',
        concept: 'Element swapping / Used boolean mask',
      },
      {
        id: 39,
        title: 'Combination Sum',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/combination-sum/',
        acceptance: '72.3%',
        concept: 'Repetition allowed branching with pruning',
      },
      {
        id: 79,
        title: 'Word Search',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/word-search/',
        acceptance: '42.9%',
        concept: 'Grid backtracking with visited rollback',
      },
      {
        id: 51,
        title: 'N-Queens',
        difficulty: 'Hard',
        url: 'https://leetcode.com/problems/n-queens/',
        acceptance: '68.5%',
        concept: 'Column & diagonal constraint sets',
      },
    ],
  },
  {
    id: 'binary-search',
    name: 'Binary Search & Monotonic Space',
    shortName: 'Binary Search',
    target: 12,
    description: 'Logarithmic search over arrays, rotated ranges, and monotonic answer ranges.',
    leetcodeTags: ['Binary Search'],
    problems: [
      {
        id: 704,
        title: 'Binary Search',
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/binary-search/',
        acceptance: '58.7%',
        concept: 'Classic mid-point pointer bounds',
      },
      {
        id: 33,
        title: 'Search in Rotated Sorted Array',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
        acceptance: '41.1%',
        concept: 'One sorted half identification',
      },
      {
        id: 153,
        title: 'Find Minimum in Rotated Sorted Array',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
        acceptance: '51.4%',
        concept: 'Inflection point binary boundary',
      },
      {
        id: 875,
        title: 'Koko Eating Bananas',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/koko-eating-bananas/',
        acceptance: '48.9%',
        concept: 'Binary search over predicate function',
      },
      {
        id: 4,
        title: 'Median of Two Sorted Arrays',
        difficulty: 'Hard',
        url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
        acceptance: '40.6%',
        concept: 'Binary search on smaller array partition',
      },
    ],
  },
  {
    id: 'stacks',
    name: 'Stacks & Monotonic Queues',
    shortName: 'Stacks',
    target: 12,
    description: 'Parentheses matching, expression evaluation, and next greater/smaller element problems.',
    leetcodeTags: ['Stack', 'Monotonic Stack'],
    problems: [
      {
        id: 20,
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/valid-parentheses/',
        acceptance: '41.2%',
        concept: 'LIFO matching bracket verification',
      },
      {
        id: 739,
        title: 'Daily Temperatures',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/daily-temperatures/',
        acceptance: '66.4%',
        concept: 'Decreasing monotonic stack index storage',
      },
      {
        id: 155,
        title: 'Min Stack',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/min-stack/',
        acceptance: '54.5%',
        concept: 'O(1) auxiliary minimum tracker stack',
      },
      {
        id: 84,
        title: 'Largest Rectangle in Histogram',
        difficulty: 'Hard',
        url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
        acceptance: '44.8%',
        concept: 'Monotonic stack boundary expansion',
      },
    ],
  },
];

/**
 * Analyze user's topic counts and detect weak or deficient areas
 */
function analyzeWeakTopics(userLeetcodeData) {
  // Aggregate user's solved topic counts
  const userTopicMap = {};

  if (userLeetcodeData) {
    // 1. Direct topTopics list: [{ name: 'Dynamic Programming', solved: 12 }]
    if (Array.isArray(userLeetcodeData.topTopics)) {
      userLeetcodeData.topTopics.forEach((t) => {
        userTopicMap[t.name.toLowerCase()] = (userTopicMap[t.name.toLowerCase()] || 0) + (t.solved || 0);
      });
    }

    // 2. Raw tagProblemCounts from GraphQL
    const rawTagCounts =
      userLeetcodeData._raw?.matchedUser?.tagProblemCounts ||
      userLeetcodeData.tagProblemCounts;

    if (rawTagCounts) {
      const allTags = [
        ...(rawTagCounts.advanced || []),
        ...(rawTagCounts.intermediate || []),
        ...(rawTagCounts.fundamental || []),
      ];
      allTags.forEach((t) => {
        const name = (t.tagName || '').toLowerCase();
        userTopicMap[name] = Math.max(userTopicMap[name] || 0, t.problemsSolved || 0);
      });
    }

    // 3. Normalized leetcode topics array if present
    if (Array.isArray(userLeetcodeData.topics)) {
      userLeetcodeData.topics.forEach((t) => {
        const name = (t.name || '').toLowerCase();
        userTopicMap[name] = Math.max(userTopicMap[name] || 0, t.solved || 0);
      });
    }
  }

  // Calculate stats for each category
  const analyzedCategories = CORE_DSA_CATEGORIES.map((cat) => {
    // Sum solved count for all tags associated with this category
    let solvedCount = 0;
    cat.leetcodeTags.forEach((tag) => {
      const tagLower = tag.toLowerCase();
      if (userTopicMap[tagLower]) {
        solvedCount = Math.max(solvedCount, userTopicMap[tagLower]);
      }
    });

    const target = cat.target;
    const progressPercent = Math.min(100, Math.round((solvedCount / target) * 100));

    // Status: deficient (< 35%), developing (35% - 79%), proficient (>= 80%)
    let status;
    let badgeColor;
    let urgency;
    if (solvedCount < 5) {
      status = 'deficient';
      badgeColor = 'rose';
      urgency = 'high';
    } else if (solvedCount < target) {
      status = 'developing';
      badgeColor = 'amber';
      urgency = 'medium';
    } else {
      status = 'proficient';
      badgeColor = 'emerald';
      urgency = 'low';
    }

    return {
      id: cat.id,
      name: cat.name,
      shortName: cat.shortName,
      description: cat.description,
      target,
      solvedCount,
      progressPercent,
      status,
      badgeColor,
      urgency,
      recommendedProblems: cat.problems,
    };
  });

  // Sort: Deficient topics first (sorted by lowest solved count), then developing, then proficient
  const sortedCategories = [...analyzedCategories].sort((a, b) => {
    if (a.status !== b.status) {
      const order = { deficient: 0, developing: 1, proficient: 2 };
      return order[a.status] - order[b.status];
    }
    return a.solvedCount - b.solvedCount;
  });

  const weakTopics = sortedCategories.filter((c) => c.status !== 'proficient');
  const proficientTopics = sortedCategories.filter((c) => c.status === 'proficient');

  // Overall DSA Readiness metric
  const totalTarget = CORE_DSA_CATEGORIES.reduce((acc, c) => acc + c.target, 0);
  const totalSolvedBenchmark = analyzedCategories.reduce((acc, c) => acc + Math.min(c.solvedCount, c.target), 0);
  const overallDsaScore = Math.min(100, Math.round((totalSolvedBenchmark / totalTarget) * 100));

  // Top 4 critical action problems to solve right away
  const urgentProblems = [];
  weakTopics.slice(0, 3).forEach((topic) => {
    const candidate = topic.recommendedProblems.find((p) => p.difficulty === 'Easy' || p.difficulty === 'Medium');
    if (candidate && !urgentProblems.some((p) => p.id === candidate.id)) {
      urgentProblems.push({
        ...candidate,
        topicName: topic.name,
        topicId: topic.id,
      });
    }
  });

  return {
    overallDsaScore,
    totalCoreCategories: CORE_DSA_CATEGORIES.length,
    weakCount: weakTopics.length,
    proficientCount: proficientTopics.length,
    categories: sortedCategories,
    weakTopics,
    proficientTopics,
    urgentProblems,
  };
}

module.exports = {
  CORE_DSA_CATEGORIES,
  analyzeWeakTopics,
};
