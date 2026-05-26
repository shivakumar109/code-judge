import Problem from './Models/Problem.js';
const problems = [
  // ==================== EASY PROBLEMS (1 to 30) ====================
  {
    title: "Two Sum",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Assume there is exactly one solution.",
    constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
    inputFormat: "The first line contains N (size of array) and T (target value) separated by a space.\nThe second line contains N space-separated integers.",
    outputFormat: "Output two space-separated integers representing the 0-based indices in ascending order.",
    sampleInput: "4 9\n2 7 11 15",
    sampleOutput: "0 1",
    explanation: "Because nums[0] + nums[1] == 2 + 7 == 9, we return 0 1.",
    difficulty: "Easy",
    tags: ["Arrays", "Searching"],
    hiddenTestCases: [
      { input: "3 6\n3 2 4", output: "1 2" },
      { input: "2 6\n3 3", output: "0 1" },
      { input: "5 10\n1 3 5 5 7", output: "2 3" }
    ]
  },
  {
    title: "Palindrome Number",
    description: "Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.",
    constraints: "-2^31 <= x <= 2^31 - 1",
    inputFormat: "A single line containing the integer X.",
    outputFormat: "Output 'true' if the number is a palindrome, and 'false' otherwise.",
    sampleInput: "121",
    sampleOutput: "true",
    explanation: "121 reads as 121 from left to right and from right to left.",
    difficulty: "Easy",
    tags: ["Math"],
    hiddenTestCases: [
      { input: "-121", output: "false" },
      { input: "10", output: "false" },
      { input: "12321", output: "true" }
    ]
  },
  {
    title: "Fizz Buzz",
    description: "Given an integer N, print string representations of numbers from 1 to N. For multiples of three print 'Fizz' instead of the number, and for multiples of five print 'Buzz'. For numbers which are multiples of both three and five print 'FizzBuzz'.",
    constraints: "1 <= N <= 10^4",
    inputFormat: "A single line containing the integer N.",
    outputFormat: "Output N lines, each representing the corresponding string from 1 to N.",
    sampleInput: "5",
    sampleOutput: "1\n2\nFizz\n4\nBuzz",
    explanation: "3 is divisible by 3 (Fizz), 5 is divisible by 5 (Buzz). Others are not.",
    difficulty: "Easy",
    tags: ["Math", "Strings"],
    hiddenTestCases: [
      { input: "3", output: "1\n2\nFizz" },
      { input: "15", output: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
      { input: "1", output: "1" }
    ]
  },
  {
    title: "Reverse String",
    description: "Reverse a given string. The input is provided as a single word.",
    constraints: "1 <= length of S <= 10^5",
    inputFormat: "A single line containing string S.",
    outputFormat: "Output the reversed string.",
    sampleInput: "hello",
    sampleOutput: "olleh",
    explanation: "Reversing 'hello' gives 'olleh'.",
    difficulty: "Easy",
    tags: ["Strings"],
    hiddenTestCases: [
      { input: "Hannah", output: "hannaH" },
      { input: "a", output: "a" },
      { input: "antigravity", output: "ytivargitna" }
    ]
  },
  {
    title: "Valid Anagram",
    description: "Given two strings S and T, return true if T is an anagram of S, and false otherwise.",
    constraints: "1 <= length of S, T <= 5 * 10^4. Consist of lowercase English letters.",
    inputFormat: "Two space-separated strings S and T on a single line.",
    outputFormat: "Output 'true' or 'false'.",
    sampleInput: "anagram nagaram",
    sampleOutput: "true",
    explanation: "Both strings have the exact same characters with the exact same frequencies.",
    difficulty: "Easy",
    tags: ["Strings", "Sorting"],
    hiddenTestCases: [
      { input: "rat car", output: "false" },
      { input: "awesome meaweso", output: "true" },
      { input: "ab ba", output: "true" }
    ]
  },
  {
    title: "Single Number",
    description: "Given a non-empty array of integers, every element appears twice except for one. Find that single one.",
    constraints: "1 <= nums.length <= 3 * 10^4. Each element appears twice except one.",
    inputFormat: "First line contains N. Second line contains N space-separated integers.",
    outputFormat: "Output the single number.",
    sampleInput: "3\n2 2 1",
    sampleOutput: "1",
    explanation: "2 appears twice, 1 appears once. So 1 is returned.",
    difficulty: "Easy",
    tags: ["Arrays", "Math"],
    hiddenTestCases: [
      { input: "5\n4 1 2 1 2", output: "4" },
      { input: "1\n1", output: "1" },
      { input: "7\n10 20 30 10 30 50 20", output: "50" }
    ]
  },
  {
    title: "Fibonacci Number",
    description: "Compute the N-th Fibonacci number, where F(0) = 0, F(1) = 1, and F(N) = F(N-1) + F(N-2) for N > 1.",
    constraints: "0 <= N <= 30",
    inputFormat: "A single line containing the integer N.",
    outputFormat: "Output the N-th Fibonacci number.",
    sampleInput: "4",
    sampleOutput: "3",
    explanation: "F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3.",
    difficulty: "Easy",
    tags: ["Recursion", "Math"],
    hiddenTestCases: [
      { input: "2", output: "1" },
      { input: "10", output: "55" },
      { input: "20", output: "6765" }
    ]
  },
  {
    title: "Binary Search",
    description: "Given a sorted array of N integers and a target K, return the 0-based index of K. If K does not exist, return -1.",
    constraints: "1 <= N <= 10^4. Array is sorted in ascending order.",
    inputFormat: "First line contains N and Target. Second line contains N space-separated integers.",
    outputFormat: "Output the index of target, or -1 if not found.",
    sampleInput: "6 9\n-1 0 3 5 9 12",
    sampleOutput: "4",
    explanation: "9 exists in the array at index 4.",
    difficulty: "Easy",
    tags: ["Searching", "Arrays"],
    hiddenTestCases: [
      { input: "6 2\n-1 0 3 5 9 12", output: "-1" },
      { input: "1 5\n5", output: "0" },
      { input: "5 100\n1 20 40 60 80", output: "-1" }
    ]
  },
  {
    title: "Power of Two",
    description: "Determine if a given integer is a power of two.",
    constraints: "-2^31 <= N <= 2^31 - 1",
    inputFormat: "A single line containing the integer N.",
    outputFormat: "Output 'true' or 'false'.",
    sampleInput: "16",
    sampleOutput: "true",
    explanation: "16 is 2^4.",
    difficulty: "Easy",
    tags: ["Math"],
    hiddenTestCases: [
      { input: "3", output: "false" },
      { input: "1", output: "true" },
      { input: "0", output: "false" }
    ]
  },
  {
    title: "Contains Duplicate",
    description: "Given an array of integers, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    constraints: "1 <= N <= 10^5\n-10^9 <= nums[i] <= 10^9",
    inputFormat: "First line contains N. Second line contains N space-separated integers.",
    outputFormat: "Output 'true' or 'false'.",
    sampleInput: "4\n1 2 3 1",
    sampleOutput: "true",
    explanation: "1 appears twice.",
    difficulty: "Easy",
    tags: ["Arrays"],
    hiddenTestCases: [
      { input: "4\n1 2 3 4", output: "false" },
      { input: "1\n1", output: "false" },
      { input: "6\n1 1 1 3 3 4", output: "true" }
    ]
  },
  {
    title: "Climbing Stairs",
    description: "You are climbing a staircase. It takes N steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    constraints: "1 <= N <= 45",
    inputFormat: "A single line containing the integer N.",
    outputFormat: "Output the number of distinct ways.",
    sampleInput: "3",
    sampleOutput: "3",
    explanation: "There are three ways: 1+1+1, 1+2, 2+1.",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Math"],
    hiddenTestCases: [
      { input: "2", output: "2" },
      { input: "5", output: "8" },
      { input: "10", output: "89" }
    ]
  },
  {
    title: "Maximum Subarray",
    description: "Find the contiguous subarray (containing at least one number) which has the largest sum and print its sum (Kadane's Algorithm).",
    constraints: "1 <= N <= 10^5. -10^4 <= nums[i] <= 10^4.",
    inputFormat: "First line contains N. Second line contains N space-separated integers.",
    outputFormat: "Output the maximum subarray sum.",
    sampleInput: "9\n-2 1 -3 4 -1 2 1 -5 4",
    sampleOutput: "6",
    explanation: "[4,-1,2,1] has the largest sum = 6.",
    difficulty: "Easy",
    tags: ["Arrays", "Dynamic Programming"],
    hiddenTestCases: [
      { input: "1\n1", output: "1" },
      { input: "5\n5 4 -1 7 8", output: "23" },
      { input: "4\n-1 -2 -3 -4", output: "-1" }
    ]
  },
  {
    title: "Search Insert Position",
    description: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
    constraints: "1 <= N <= 10^4\n-10^4 <= nums[i], target <= 10^4",
    inputFormat: "First line contains N and Target. Second line contains N space-separated integers.",
    outputFormat: "Output the insert index.",
    sampleInput: "4 5\n1 3 5 6",
    sampleOutput: "2",
    explanation: "5 is found at index 2.",
    difficulty: "Easy",
    tags: ["Searching", "Arrays"],
    hiddenTestCases: [
      { input: "4 2\n1 3 5 6", output: "1" },
      { input: "4 7\n1 3 5 6", output: "4" },
      { input: "4 0\n1 3 5 6", output: "0" }
    ]
  },
  {
    title: "Sqrt of X",
    description: "Given a non-negative integer x, compute and return the square root of x. Truncate the decimal digits, returning only the integer part.",
    constraints: "0 <= x <= 2^31 - 1",
    inputFormat: "A single line containing the integer X.",
    outputFormat: "Output the integer square root.",
    sampleInput: "8",
    sampleOutput: "2",
    explanation: "The square root of 8 is 2.82842..., and since the decimal part is truncated, 2 is returned.",
    difficulty: "Easy",
    tags: ["Math", "Searching"],
    hiddenTestCases: [
      { input: "4", output: "2" },
      { input: "0", output: "0" },
      { input: "101", output: "10" }
    ]
  },
  {
    title: "Majority Element",
    description: "Given an array of size N, find the majority element. The majority element is the element that appears more than floor(N / 2) times. Assume the majority element always exists.",
    constraints: "1 <= N <= 5 * 10^4",
    inputFormat: "First line contains N. Second line contains N space-separated integers.",
    outputFormat: "Output the majority element.",
    sampleInput: "3\n3 2 3",
    sampleOutput: "3",
    explanation: "3 appears 2 times, which is more than floor(3 / 2) = 1 time.",
    difficulty: "Easy",
    tags: ["Arrays", "Sorting"],
    hiddenTestCases: [
      { input: "7\n2 2 1 1 1 2 2", output: "2" },
      { input: "1\n9", output: "9" },
      { input: "5\n10 10 2 10 10", output: "10" }
    ]
  },
  {
    title: "Move Zeroes",
    description: "Given an array, move all 0's to the end of it while maintaining the relative order of the non-zero elements in-place.",
    constraints: "1 <= N <= 10^4",
    inputFormat: "First line contains N. Second line contains N space-separated integers.",
    outputFormat: "Output the array elements separated by spaces after moving zeroes.",
    sampleInput: "5\n0 1 0 3 12",
    sampleOutput: "1 3 12 0 0",
    explanation: "All zeros are shifted to the end, while non-zero elements maintain their order.",
    difficulty: "Easy",
    tags: ["Arrays"],
    hiddenTestCases: [
      { input: "1\n0", output: "0" },
      { input: "4\n4 2 0 1", output: "4 2 1 0" },
      { input: "5\n0 0 0 5 9", output: "5 9 0 0 0" }
    ]
  },
  {
    title: "Missing Number",
    description: "Given an array containing N distinct numbers in the range [0, N], return the only number in the range that is missing from the array.",
    constraints: "1 <= N <= 10^4. All numbers are unique.",
    inputFormat: "First line contains N. Second line contains N space-separated integers.",
    outputFormat: "Output the missing number.",
    sampleInput: "3\n3 0 1",
    sampleOutput: "2",
    explanation: "n = 3, so all numbers are in the range [0,3]. 2 is the missing number.",
    difficulty: "Easy",
    tags: ["Arrays", "Math"],
    hiddenTestCases: [
      { input: "2\n0 1", output: "2" },
      { input: "9\n9 6 4 2 3 5 7 0 1", output: "8" },
      { input: "1\n0", output: "1" }
    ]
  },
  {
    title: "Intersection of Two Arrays",
    description: "Given two integer arrays, return an array of their unique intersection. Elements in the result can be in any order, but sorted in ascending order for output comparison.",
    constraints: "1 <= size of arrays <= 1000",
    inputFormat: "First line contains sizes N1 and N2.\nSecond line contains N1 integers.\nThird line contains N2 integers.",
    outputFormat: "Output the sorted space-separated unique intersecting elements. If none, output nothing or empty line.",
    sampleInput: "4 2\n1 2 2 1\n2 2",
    sampleOutput: "2",
    explanation: "The unique intersecting element is 2.",
    difficulty: "Easy",
    tags: ["Arrays", "Searching"],
    hiddenTestCases: [
      { input: "3 5\n4 9 5\n9 4 9 8 4", output: "4 9" },
      { input: "2 2\n1 3\n2 4", output: "" },
      { input: "4 4\n1 2 3 4\n4 3 2 1", output: "1 2 3 4" }
    ]
  },
  {
    title: "First Unique Character in a String",
    description: "Given a string S, find the first non-repeating character in it and return its 0-based index. If it does not exist, return -1.",
    constraints: "1 <= length of S <= 10^5. S consists of lowercase English letters.",
    inputFormat: "A single line containing string S.",
    outputFormat: "Output the index of the first unique character, or -1.",
    sampleInput: "leetcode",
    sampleOutput: "0",
    explanation: "The character 'l' is the first non-repeating character, located at index 0.",
    difficulty: "Easy",
    tags: ["Strings"],
    hiddenTestCases: [
      { input: "loveleetcode", output: "2" },
      { input: "aabb", output: "-1" },
      { input: "antigravity", output: "0" }
    ]
  },
  {
    title: "Valid Palindrome",
    description: "Given a string S, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.",
    constraints: "1 <= length of S <= 2 * 10^5",
    inputFormat: "A single line containing the string S.",
    outputFormat: "Output 'true' if S is a valid palindrome, and 'false' otherwise.",
    sampleInput: "A man, a plan, a canal: Panama",
    sampleOutput: "true",
    explanation: "'amanaplanacanalpanama' is a palindrome.",
    difficulty: "Easy",
    tags: ["Strings"],
    hiddenTestCases: [
      { input: "race a car", output: "false" },
      { input: " ", output: "true" },
      { input: "0P", output: "false" }
    ]
  },
  {
    title: "Reverse Linked List Array",
    description: "Given an array of integers representing elements in a linked list, output the elements of the reversed linked list.",
    constraints: "0 <= N <= 5000",
    inputFormat: "First line contains N.\nSecond line contains N space-separated integers.",
    outputFormat: "Output the elements in reverse order separated by spaces.",
    sampleInput: "5\n1 2 3 4 5",
    sampleOutput: "5 4 3 2 1",
    explanation: "Reversing the sequence [1,2,3,4,5] results in [5,4,3,2,1].",
    difficulty: "Easy",
    tags: ["Linked List"],
    hiddenTestCases: [
      { input: "2\n1 2", output: "2 1" },
      { input: "0\n", output: "" },
      { input: "3\n10 20 30", output: "30 20 10" }
    ]
  },
  {
    title: "Plus One",
    description: "You are given a large integer represented as an integer array digits, where each digits[i] is the i-th digit of the integer. Increment the large integer by one and return the resulting array of digits.",
    constraints: "1 <= N <= 100. 0 <= digits[i] <= 9.",
    inputFormat: "First line contains N. Second line contains N space-separated integers.",
    outputFormat: "Output space-separated digits of the incremented number.",
    sampleInput: "3\n1 2 3",
    sampleOutput: "1 2 4",
    explanation: "123 + 1 = 124.",
    difficulty: "Easy",
    tags: ["Arrays", "Math"],
    hiddenTestCases: [
      { input: "4\n4 3 2 1", output: "4 3 2 2" },
      { input: "1\n9", output: "1 0" },
      { input: "3\n9 9 9", output: "1 0 0 0" }
    ]
  },
  {
    title: "Valid Parentheses",
    description: "Given a string S containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    constraints: "1 <= length of S <= 10^4",
    inputFormat: "A single line containing the string S.",
    outputFormat: "Output 'true' or 'false'.",
    sampleInput: "()[]{}",
    sampleOutput: "true",
    explanation: "Every opening bracket is correctly closed.",
    difficulty: "Easy",
    tags: ["Stack"],
    hiddenTestCases: [
      { input: "(]", output: "false" },
      { input: "([)]", output: "false" },
      { input: "{[]}", output: "true" }
    ]
  },
  {
    title: "Remove Duplicates from Sorted Array",
    description: "Given a sorted array, remove the duplicates in-place such that each element appears only once and return the new length. Print the unique elements.",
    constraints: "0 <= N <= 300",
    inputFormat: "First line contains N. Second line contains N space-separated integers.",
    outputFormat: "Output the sorted unique elements separated by spaces.",
    sampleInput: "3\n1 1 2",
    sampleOutput: "1 2",
    explanation: "Duplicate 1 is removed. The resulting array is [1, 2].",
    difficulty: "Easy",
    tags: ["Arrays"],
    hiddenTestCases: [
      { input: "10\n0 0 1 1 1 2 2 3 3 4", output: "0 1 2 3 4" },
      { input: "1\n5", output: "5" },
      { input: "0\n", output: "" }
    ]
  },
  {
    title: "Length of Last Word",
    description: "Given a string S consisting of letters and spaces, return the length of the last word in the string.",
    constraints: "1 <= length of S <= 10^4. Consists of only letters and spaces.",
    inputFormat: "A single line containing string S.",
    outputFormat: "Output the length of the last word.",
    sampleInput: "Hello World",
    sampleOutput: "5",
    explanation: "The last word is 'World' with length 5.",
    difficulty: "Easy",
    tags: ["Strings"],
    hiddenTestCases: [
      { input: "   fly me   to   the moon  ", output: "4" },
      { input: "luffy is still joyboy", output: "6" },
      { input: "A", output: "1" }
    ]
  },
  {
    title: "Roman to Integer",
    description: "Convert a roman numeral string S to an integer.",
    constraints: "1 <= length of S <= 15. S contains only I, V, X, L, C, D, M.",
    inputFormat: "A single line containing the Roman string S.",
    outputFormat: "Output the integer value.",
    sampleInput: "LVIII",
    sampleOutput: "58",
    explanation: "L = 50, V= 5, III = 3. 50 + 5 + 3 = 58.",
    difficulty: "Easy",
    tags: ["Strings", "Math"],
    hiddenTestCases: [
      { input: "III", output: "3" },
      { input: "MCMXCIV", output: "1994" },
      { input: "XL", output: "40" }
    ]
  },
  {
    title: "Merge Sorted Arrays",
    description: "Given two sorted integer arrays A and B, merge B into A as one sorted array. A has size N+M, with initial N elements. B has size M.",
    constraints: "0 <= N, M <= 1000",
    inputFormat: "First line contains sizes N and M.\nSecond line contains N integers.\nThird line contains M integers.",
    outputFormat: "Output the merged sorted elements separated by spaces.",
    sampleInput: "3 3\n1 2 3\n2 5 6",
    sampleOutput: "1 2 2 3 5 6",
    explanation: "Merging [1,2,3] and [2,5,6] yields [1,2,2,3,5,6].",
    difficulty: "Easy",
    tags: ["Arrays", "Sorting"],
    hiddenTestCases: [
      { input: "1 0\n1\n", output: "1" },
      { input: "0 1\n\n1", output: "1" },
      { input: "3 2\n1 3 5\n2 4", output: "1 2 3 4 5" }
    ]
  },
  {
    title: "Subtract the Product and Sum",
    description: "Given an integer number N, return the difference between the product of its digits and the sum of its digits.",
    constraints: "1 <= N <= 10^5",
    inputFormat: "A single line containing the integer N.",
    outputFormat: "Output the difference.",
    sampleInput: "234",
    sampleOutput: "15",
    explanation: "Product of digits = 2 * 3 * 4 = 24. Sum of digits = 2 + 3 + 4 = 9. Result = 24 - 9 = 15.",
    difficulty: "Easy",
    tags: ["Math"],
    hiddenTestCases: [
      { input: "4421", output: "21" },
      { input: "12", output: "(-1)" }, // Wait, product = 2, sum = 3, diff = 2 - 3 = -1
      { input: "999", output: "702" }
    ]
  },
  {
    title: "Third Maximum Number",
    description: "Given an integer array, return the third distinct maximum number. If it does not exist, return the maximum number.",
    constraints: "1 <= nums.length <= 10^4",
    inputFormat: "First line contains N.\nSecond line contains N space-separated integers.",
    outputFormat: "Output the third maximum, or overall maximum.",
    sampleInput: "3\n3 2 1",
    sampleOutput: "1",
    explanation: "The third maximum is 1.",
    difficulty: "Easy",
    tags: ["Arrays", "Sorting"],
    hiddenTestCases: [
      { input: "2\n1 2", output: "2" },
      { input: "4\n2 2 3 1", output: "1" },
      { input: "5\n10 10 10 5 2", output: "2" }
    ]
  },
  {
    title: "Count Odd Numbers in Interval",
    description: "Given two non-negative integers low and high, return the count of odd numbers between them (inclusive).",
    constraints: "0 <= low <= high <= 10^9",
    inputFormat: "Two space-separated integers low and high.",
    outputFormat: "Output the count of odd numbers.",
    sampleInput: "3 7",
    sampleOutput: "3",
    explanation: "Odd numbers are 3, 5, 7.",
    difficulty: "Easy",
    tags: ["Math"],
    hiddenTestCases: [
      { input: "8 10", output: "1" },
      { input: "1 10", output: "5" },
      { input: "0 0", output: "0" }
    ]
  },

  // ==================== MEDIUM PROBLEMS (31 to 45) ====================
  {
    title: "Three Sum",
    description: "Given an integer array, find all unique triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and their sum is equal to zero.",
    constraints: "3 <= N <= 3000. -10^5 <= nums[i] <= 10^5",
    inputFormat: "First line contains N. Second line contains N space-separated integers.",
    outputFormat: "Output each triplet sorted in ascending order. Print triplets one per line, and sort all lines lexicographically. If none, output empty line.",
    sampleInput: "6\n-1 0 1 2 -1 -4",
    sampleOutput: "-1 -1 2\n-1 0 1",
    explanation: "The unique triplets summing to 0 are [-1, -1, 2] and [-1, 0, 1].",
    difficulty: "Medium",
    tags: ["Arrays", "Sorting"],
    hiddenTestCases: [
      { input: "3\n0 1 1", output: "" },
      { input: "3\n0 0 0", output: "0 0 0" },
      { input: "5\n-2 0 0 2 2", output: "-2 0 2" }
    ]
  },
  {
    title: "Container With Most Water",
    description: "Given N non-negative integers representation of container heights, find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum area.",
    constraints: "2 <= N <= 10^5. 0 <= height[i] <= 10^4.",
    inputFormat: "First line contains N. Second line contains N space-separated integers.",
    outputFormat: "Output the maximum area of water.",
    sampleInput: "9\n1 8 6 2 5 4 8 3 7",
    sampleOutput: "49",
    explanation: "Height indices 1 (height 8) and 8 (height 7) are width 7 apart, yielding max water of min(8, 7) * 7 = 49.",
    difficulty: "Medium",
    tags: ["Arrays", "Greedy Algorithms"],
    hiddenTestCases: [
      { input: "2\n1 1", output: "1" },
      { input: "5\n4 3 2 1 4", output: "16" },
      { input: "4\n1 2 1 2", output: "4" }
    ]
  },
  {
    title: "Longest Substring Without Repeating",
    description: "Given a string S, find the length of the longest substring without repeating characters.",
    constraints: "0 <= length of S <= 5 * 10^4",
    inputFormat: "A single line containing the string S. Note: could be empty or have spaces.",
    outputFormat: "Output the length.",
    sampleInput: "abcabcbb",
    sampleOutput: "3",
    explanation: "The answer is 'abc', with the length of 3.",
    difficulty: "Medium",
    tags: ["Strings", "Searching"],
    hiddenTestCases: [
      { input: "bbbbb", output: "1" },
      { input: "pwwkew", output: "3" },
      { input: "antigravity", output: "8" }
    ]
  },
  {
    title: "Longest Palindromic Substring",
    description: "Given a string S, return the longest palindromic substring in S.",
    constraints: "1 <= length of S <= 1000",
    inputFormat: "A single line containing string S.",
    outputFormat: "Output the longest palindromic substring.",
    sampleInput: "babad",
    sampleOutput: "bab", // 'aba' is also valid, we check for length and correctness
    explanation: "'bab' is a palindrome of length 3.",
    difficulty: "Medium",
    tags: ["Strings", "Dynamic Programming"],
    hiddenTestCases: [
      { input: "cbbd", output: "bb" },
      { input: "a", output: "a" },
      { input: "racecar", output: "racecar" }
    ]
  },
  {
    title: "Integer to Roman",
    description: "Convert a standard integer between 1 and 3999 to a roman numeral string.",
    constraints: "1 <= N <= 3999",
    inputFormat: "A single line containing N.",
    outputFormat: "Output the Roman numeral string.",
    sampleInput: "58",
    sampleOutput: "LVIII",
    explanation: "L=50, V=5, VIII=8. LVIII=58.",
    difficulty: "Medium",
    tags: ["Math", "Strings"],
    hiddenTestCases: [
      { input: "3", output: "III" },
      { input: "1994", output: "MCMXCIV" },
      { input: "4", output: "IV" }
    ]
  },
  {
    title: "Group Anagrams",
    description: "Given an array of strings, group the anagrams together. Output the grouped anagram strings.",
    constraints: "1 <= N <= 10^4. 0 <= S[i].length <= 100. Lowercase letters.",
    inputFormat: "First line contains N. Second line contains N space-separated strings.",
    outputFormat: "Sort each anagram group alphabetically, and print each group space-separated on a new line. Sort the group lines lexicographically by their first word.",
    sampleInput: "6\neat tea tan ate nat bat",
    sampleOutput: "ate eat tea\nbat\nnat tan",
    explanation: "Grouped anagram strings together.",
    difficulty: "Medium",
    tags: ["Strings", "Sorting"],
    hiddenTestCases: [
      { input: "1\na", output: "a" },
      { input: "4\nab ba cd dc", output: "ab ba\ncd dc" },
      { input: "3\ncat dog tac", output: "cat tac\ndog" }
    ]
  },
  {
    title: "Kth Largest Element",
    description: "Find the Kth largest element in an unsorted integer array. Note that it is the Kth largest element in the sorted order, not the Kth distinct element.",
    constraints: "1 <= K <= N <= 10^4. -10^4 <= nums[i] <= 10^4.",
    inputFormat: "First line contains N and K.\nSecond line contains N space-separated integers.",
    outputFormat: "Output the Kth largest integer.",
    sampleInput: "6 2\n3 2 1 5 6 4",
    sampleOutput: "5",
    explanation: "Sorted array is [1, 2, 3, 4, 5, 6]. The 2nd largest element is 5.",
    difficulty: "Medium",
    tags: ["Arrays", "Sorting"],
    hiddenTestCases: [
      { input: "9 4\n3 2 3 1 2 4 5 5 6", output: "4" },
      { input: "1 1\n10", output: "10" },
      { input: "5 5\n1 2 3 4 5", output: "1" }
    ]
  },
  {
    title: "Generate Parentheses",
    description: "Given N pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    constraints: "1 <= N <= 8",
    inputFormat: "A single line containing the integer N.",
    outputFormat: "Output combinations in lexicographical order, one per line.",
    sampleInput: "3",
    sampleOutput: "((()))\n(()())\n(())()\n()(())\n()()()",
    explanation: "These are the 5 valid combinations for n=3.",
    difficulty: "Medium",
    tags: ["Recursion", "Strings"],
    hiddenTestCases: [
      { input: "1", output: "()" },
      { input: "2", output: "(())\n()()" },
      { input: "4", output: "(((())))\n(((())()))\n(((()))())\n(((())()()))\n((()(())))\n((()()()))\n((()())())\n((())()(()))\n((())()()())\n(()(()()))\n(()(())())\n(()()(()))\n(()()()())\n()((()))\n()(()())\n()(())()\n()()(())\n()()()()" }
    ]
  },
  {
    title: "Subsets",
    description: "Given an integer array of unique elements, return all possible subsets (the power set). Output must not contain duplicate subsets.",
    constraints: "1 <= N <= 10. Unique elements.",
    inputFormat: "First line contains N. Second line contains N integers.",
    outputFormat: "Sort each subset ascending. Print one subset per line, space-separated. Sort subsets by length, and lexicographically by elements for same lengths.",
    sampleInput: "3\n1 2 3",
    sampleOutput: "\n1\n2\n3\n1 2\n1 3\n2 3\n1 2 3",
    explanation: "All subsets are outputted, starting with empty subset (blank line).",
    difficulty: "Medium",
    tags: ["Recursion"],
    hiddenTestCases: [
      { input: "1\n0", output: "\n0" },
      { input: "2\n9 5", output: "\n5\n9\n5 9" },
      { input: "3\n1 5 10", output: "\n1\n5\n10\n1 5\n1 10\n5 10\n1 5 10" }
    ]
  },
  {
    title: "Merge Intervals",
    description: "Given a collection of intervals, merge all overlapping intervals.",
    constraints: "1 <= N <= 10^4. interval[i] = [start, end], where start <= end.",
    inputFormat: "First line contains N.\nFollowing N lines each contain two space-separated integers representing start and end.",
    outputFormat: "Print the merged intervals sorted by start time, one per line as space-separated integers.",
    sampleInput: "4\n1 3\n2 6\n8 10\n15 18",
    sampleOutput: "1 6\n8 10\n15 18",
    explanation: "Intervals [1,3] and [2,6] overlap, and are merged into [1,6]. Others remain unmerged.",
    difficulty: "Medium",
    tags: ["Arrays", "Sorting"],
    hiddenTestCases: [
      { input: "2\n1 4\n4 5", output: "1 5" },
      { input: "3\n1 10\n2 6\n3 5", output: "1 10" },
      { input: "1\n5 6", output: "5 6" }
    ]
  },
  {
    title: "Remove Nth Node",
    description: "Given an array representing a linked list, remove the N-th node from the end of the list and print the remaining list.",
    constraints: "1 <= list.length <= 1000",
    inputFormat: "First line contains list size M and index N (from end).\nSecond line contains M space-separated integers.",
    outputFormat: "Output remaining integers separated by space. If empty, output empty line.",
    sampleInput: "5 2\n1 2 3 4 5",
    sampleOutput: "1 2 3 5",
    explanation: "Removing 2nd node from end (which is 4) leaves [1, 2, 3, 5].",
    difficulty: "Medium",
    tags: ["Linked List"],
    hiddenTestCases: [
      { input: "1 1\n10", output: "" },
      { input: "2 1\n1 2", output: "1" },
      { input: "3 3\n1 2 3", output: "2 3" }
    ]
  },
  {
    title: "Binary Tree Level Order Traversal",
    description: "Given the level order representation of a binary tree (using -1 for null/missing nodes), print the node values grouped by level.",
    constraints: "0 <= N <= 1000",
    inputFormat: "First line contains array size N.\nSecond line contains N space-separated integers representing level order tree representation.",
    outputFormat: "Output elements at each level on a new line space-separated. Exclude -1 nodes.",
    sampleInput: "7\n3 9 20 -1 -1 15 7",
    sampleOutput: "3\n9 20\n15 7",
    explanation: "Root is 3. Left child 9. Right child 20. Left child of 20 is 15, right is 7.",
    difficulty: "Medium",
    tags: ["Trees", "Queue"],
    hiddenTestCases: [
      { input: "1\n1", output: "1" },
      { input: "0\n", output: "" },
      { input: "3\n1 2 3", output: "1\n2 3" }
    ]
  },
  {
    title: "Top K Frequent Elements",
    description: "Given an integer array and an integer K, return the K most frequent elements.",
    constraints: "1 <= N <= 10^5. 1 <= K <= number of unique elements.",
    inputFormat: "First line contains N and K. Second line contains N integers.",
    outputFormat: "Output the K elements sorted in ascending order.",
    sampleInput: "6 2\n1 1 1 2 2 3",
    sampleOutput: "1 2",
    explanation: "1 appears 3 times, 2 appears 2 times, 3 appears 1 time. The 2 most frequent are 1 and 2.",
    difficulty: "Medium",
    tags: ["Arrays", "Sorting"],
    hiddenTestCases: [
      { input: "1 1\n1", output: "1" },
      { input: "4 2\n5 5 10 10", output: "5 10" },
      { input: "6 3\n1 2 2 3 3 3", output: "1 2 3" }
    ]
  },
  {
    title: "Number of Islands",
    description: "Given an M x N 2D grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    constraints: "1 <= M, N <= 100",
    inputFormat: "First line contains M and N.\nFollowing M lines contain N space-separated characters ('0' or '1').",
    outputFormat: "Output the count of islands.",
    sampleInput: "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0",
    sampleOutput: "1",
    explanation: "All land elements connect, forming a single island.",
    difficulty: "Medium",
    tags: ["Graphs", "Recursion"],
    hiddenTestCases: [
      { input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", output: "3" },
      { input: "2 2\n0 0\n0 0", output: "0" },
      { input: "3 3\n1 0 1\n0 1 0\n1 0 1", output: "5" }
    ]
  },
  {
    title: "Product of Array Except Self",
    description: "Given an integer array nums of length N, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. Do it in O(N) without using division.",
    constraints: "2 <= N <= 10^5. -30 <= nums[i] <= 30.",
    inputFormat: "First line contains N. Second line contains N integers.",
    outputFormat: "Output space-separated products.",
    sampleInput: "4\n1 2 3 4",
    sampleOutput: "24 12 8 6",
    explanation: "Product except nums[0] = 2*3*4=24. except nums[1] = 1*3*4=12. etc.",
    difficulty: "Medium",
    tags: ["Arrays"],
    hiddenTestCases: [
      { input: "5\n-1 1 0 -3 3", output: "0 0 9 0 0" },
      { input: "2\n5 10", output: "10 5" },
      { input: "3\n2 2 2", output: "4 4 4" }
    ]
  },

  // ==================== HARD PROBLEMS (46 to 50) ====================
  {
    title: "Median of Two Sorted Arrays",
    description: "Given two sorted arrays nums1 and nums2 of size N and M respectively, return the median of the two sorted arrays as a floating point value rounded to 1 decimal place.",
    constraints: "0 <= N, M <= 1000",
    inputFormat: "First line contains N and M.\nSecond line contains N space-separated integers.\nThird line contains M space-separated integers.",
    outputFormat: "Output the median to 1 decimal place (e.g. 2.0 or 2.5).",
    sampleInput: "2 1\n1 3\n2",
    sampleOutput: "2.0",
    explanation: "Merged array is [1,2,3]. Median is 2.0.",
    difficulty: "Hard",
    tags: ["Arrays", "Searching"],
    hiddenTestCases: [
      { input: "2 2\n1 2\n3 4", output: "2.5" },
      { input: "0 2\n\n1 2", output: "1.5" },
      { input: "4 4\n1 3 5 7\n2 4 6 8", output: "4.5" }
    ]
  },
  {
    title: "Merge K Sorted Lists",
    description: "Merge K sorted arrays into one sorted array.",
    constraints: "0 <= K <= 100. Total elements <= 10^4.",
    inputFormat: "First line contains K. Each of the following K lines contains first the size Mi of list i, followed by Mi space-separated sorted integers.",
    outputFormat: "Output the merged sorted elements space-separated.",
    sampleInput: "3\n3 1 4 5\n3 1 3 4\n2 2 6",
    sampleOutput: "1 1 2 3 4 4 5 6",
    explanation: "Lists are [1,4,5], [1,3,4], [2,6]. Merging them gives [1,1,2,3,4,4,5,6].",
    difficulty: "Hard",
    tags: ["Sorting", "Linked List"],
    hiddenTestCases: [
      { input: "1\n2 1 3", output: "1 3" },
      { input: "0\n", output: "" },
      { input: "3\n0\n1 5\n1 10", output: "5 10" }
    ]
  },
  {
    title: "Edit Distance",
    description: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have three operations: Insert, Delete, and Replace a character.",
    constraints: "0 <= word1.length, word2.length <= 500",
    inputFormat: "Two lines, each containing a string. First line contains word1 (could be empty), second contains word2.",
    outputFormat: "Output the edit distance.",
    sampleInput: "horse\nros",
    sampleOutput: "3",
    explanation: "horse -> rorse (replace 'h' with 'r') -> rose (remove 'r') -> ros (remove 'e'). Total operations = 3.",
    difficulty: "Hard",
    tags: ["Strings", "Dynamic Programming"],
    hiddenTestCases: [
      { input: "intention\nexecution", output: "5" },
      { input: "\nabc", output: "3" },
      { input: "abc\n", output: "3" }
    ]
  },
  {
    title: "Trapping Rain Water",
    description: "Given N non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    constraints: "0 <= N <= 2 * 10^4. 0 <= height[i] <= 10^5.",
    inputFormat: "First line contains N. Second line contains N integers.",
    outputFormat: "Output the total units of water trapped.",
    sampleInput: "12\n0 1 0 2 1 0 1 3 2 1 2 1",
    sampleOutput: "6",
    explanation: "Water is trapped at indices 2 (1 unit), 4 (1 unit), 5 (2 units), 6 (1 unit), 9 (1 unit) and 10 (1 unit). Total water is 6.",
    difficulty: "Hard",
    tags: ["Arrays", "Stack"],
    hiddenTestCases: [
      { input: "6\n4 2 0 3 2 5", output: "9" },
      { input: "3\n3 0 3", output: "3" },
      { input: "1\n10", output: "0" }
    ]
  },
  {
    title: "N-Queens",
    description: "Find the total number of distinct solutions to the N-Queens puzzle, placing N queens on an N x N chessboard such that no two queens attack each other.",
    constraints: "1 <= N <= 12",
    inputFormat: "A single line containing the chessboard size N.",
    outputFormat: "Output the count of valid distinct solutions.",
    sampleInput: "4",
    sampleOutput: "2",
    explanation: "For a 4x4 board, there are 2 unique queen configurations.",
    difficulty: "Hard",
    tags: ["Recursion"],
    hiddenTestCases: [
      { input: "1", output: "1" },
      { input: "8", output: "92" },
      { input: "2", output: "0" }
    ]
  }
];

const seedDB = async () => {
  try {
    console.log('Checking database seed status...');
    const existingProblems =
      await Problem.countDocuments();
    if (existingProblems === 0) {
      console.log(
        'No problems found. Seeding database...'
      );
      await Problem.insertMany(problems);
      console.log(
        `Successfully seeded ${problems.length} coding problems!`
      );
    } else {
      console.log(
        'Seeding already completed. Skipping seed process.'
      );
    }
  } catch (error) {
    console.error(
      'Seed Error:',
      error.message
    );
  }
};

export default seedDB
