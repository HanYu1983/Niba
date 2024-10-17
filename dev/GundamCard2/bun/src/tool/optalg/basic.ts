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
			console.log(gene.getFitness())
		}
	}
	return gene;
}


export function geneticAlgorithm(iteration: number, mutateRate: number, population: IGene[]): IGene[] {
	// 初期化族群適應度
	population.forEach(gene => gene.calcFitness())
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
			let child = parent1.crossover(parent2);

			// 突變
			if (Math.random() < mutateRate) {
				// 爬山演算法加速收斂
				child = hillClimbing(10, child);
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
export function optAlgByPSO(iteration: number, population: IGene[]): IGene[] {
	population.forEach(gene => gene.calcFitness())
	// 個人最佳
	const bestGenes = [...population]
	// 群體最佳
	let globalBestGene = getBest(bestGenes);

	for (let i = 0; i < iteration; i++) {
		for (let j = 0; j < population.length; j++) {
			const gene = population[j]
			// 突變
			let nextGene = hillClimbing(10, gene);
			// 和群體最佳解雜交
			nextGene = nextGene.crossover(globalBestGene)
			// 和個人最佳解雜交
			nextGene = nextGene.crossover(bestGenes[j])
			const nextFitness = nextGene.calcFitness()
			// 更新最佳解
			if (nextFitness > gene.getFitness()) {
				bestGenes[j] = nextGene;
			}
			if (nextFitness > globalBestGene.getFitness()) {
				globalBestGene = nextGene;
			}
			// 下一世代
			population[j] = nextGene;
		}
	}
	return population
}