import { getBest, IGene } from "./IGene";

export function hillClimbing(iteration: number, gene: IGene): IGene {
	for (let i = 0; i < iteration; i++) {
		const clone = gene.mutate()
		if (clone.calcFitness() > gene.getFitness()) {
			gene = clone;
			console.log(gene.getFitness())
		}
	}
	return gene;
}

export function simulatedAnnealing(iteration: number, T: number, factor: number, gene: IGene): IGene {
	if (T <= 0) {
		throw new Error("T cannot be 0"); // Use throw for clearer error handling
	}
	gene.calcFitness()
	const P = (oldFitness: number, newFitness: number, temperature: number): number => {
		return newFitness > oldFitness ? 1.0 : Math.exp((newFitness - oldFitness) / temperature);
	};
	for (let i = 0; i < iteration; i++) {
		const clone = gene.mutate();
		T *= factor;
		const oldFitness = gene.getFitness();
		const newFitness = clone.calcFitness();
		const acceptanceProbability = P(oldFitness, newFitness, T);
		if (acceptanceProbability > Math.random()) {
			gene = clone;
		}
	}
	return gene;
}


export function geneticAlgorithm(iteration: number, W: number, initForwardTimes: number, mutateRate: number, gene: IGene): IGene[] {
	// 所有基因隨機試圖登頂
	// 盡量平均散佈在解空間
	let population = [...Array(W).keys()].map(() => {
		const nextGene = hillClimbing(initForwardTimes, gene)
		nextGene.calcFitness()
		return nextGene
	})
	for (let i = 0; i < iteration; i++) {
		// 找出最佳個體
		const bestGene = getBest(population)
		// 建立選擇池
		const pool: IGene[] = [];
		for (const gene of population) {
			const num = Math.floor((gene.getFitness() / bestGene.getFitness()) * 100);
			for (let j = 0; j < num; j++) {
				pool.push(gene);
			}
		}
		// 新一代族群
		const nextPopulation: IGene[] = [];
		for (let i = 0; i < population.length; i++) {
			// 選擇兩個親代
			const parent1 = pool[Math.floor(Math.random() * pool.length)];
			const parent2 = pool[Math.floor(Math.random() * pool.length)];

			// 交叉
			if (parent1.crossover == null) {
				throw new Error()
			}
			let child = parent1.crossover(parent2);

			// 突變
			if (Math.random() < mutateRate) {
				child = child.mutate()
			}

			// 計算子代適應度
			child.calcFitness();

			nextPopulation.push(child);
		}

		population = nextPopulation;
	}

	return population;
}

// optAlgByPSO is PSO粒子群演算法修改
export function optAlgByPSO(iteration: number, W: number, initForwardTimes: number, mutateRate: number, gene: IGene): IGene[] {
	// 所有基因隨機試圖登頂
	// 盡量平均散佈在解空間
	const population = [...Array(W).keys()].map(() => {
		const nextGene = hillClimbing(initForwardTimes, gene)
		nextGene.calcFitness()
		return nextGene
	})
	// 個人最佳
	const bestGenes = [...population]
	// 群體最佳
	let globalBestGene = getBest(bestGenes);

	for (let i = 0; i < iteration; i++) {
		for (let j = 0; j < population.length; j++) {
			let nextGene = population[j]
			// 和群體最佳解雜交
			if (nextGene.crossover == null) {
				throw new Error()
			}
			nextGene = nextGene.crossover(globalBestGene)
			if (nextGene.crossover == null) {
				throw new Error()
			}
			// 和個人最佳解雜交
			nextGene = nextGene.crossover(bestGenes[j])
			// 突變
			if (Math.random() < mutateRate) {
				nextGene = nextGene.mutate()
			}
			const nextFitness = nextGene.calcFitness()
			// 更新最佳解
			if (nextFitness > bestGenes[j].getFitness()) {
				bestGenes[j] = nextGene;
			}
			// 更新群體最佳解
			if (nextFitness > globalBestGene.getFitness()) {
				globalBestGene = nextGene;
			}
			// 下一世代
			population[j] = nextGene;
		}
	}
	return population
}

// 動態規劃
export function DSP(W: number, H: number, gene: IGene): IGene {
	gene.calcFitness()
	let bestGene = gene
	// 記下計算過的解
	const accScorePool: { [key: string]: number } = {}
	function nextBranch(gene: IGene, deep: number): void {
		if (deep > H) {
			return
		}
		[...Array(W).keys()].forEach(() => {
			// 移動一步
			const nextGene = gene.mutate()
			const newScore = nextGene.calcFitness()
			if (nextGene.getStateKey == null) {
				throw new Error()
			}
			// 若已計算過, 就回傳
			const key = nextGene.getStateKey()
			if (accScorePool[key]) {
				return
			}
			const nextAccScore = newScore
			// 記下這次的解
			accScorePool[key] = nextAccScore
			// 更新最佳解
			if (nextAccScore > bestGene.getFitness()) {
				bestGene = nextGene
			}
			// 再次分支
			return nextBranch(nextGene, deep + 1)
		})
	}
	nextBranch(gene, 0)
	return bestGene
}