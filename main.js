'use strict';

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
}

function generateLetter() {
  const code = random(97, 123); 
  return String.fromCharCode(code);
}

class Member {
  constructor(target) {
    this.target = target;
    this.keys = [];

    for (let i = 0; i < target.length; i += 1) {
      this.keys[i] = generateLetter();
    }
  }

  fitness() {
    let matches = 0;

    for (let i = 0; i < this.keys.length; i += 1) {
      if (this.keys[i] === this.target[i]) {
        matches += 1;
      }
    }

    return matches / this.target.length;
  }

  crossover(partner) {
    const { length } = this.target;
    const child = new Member(this.target);
    const midpoint = random(0, length);

    for (let i = 0; i < length; i += 1) {
      if (i > midpoint) {
        child.keys[i] = this.keys[i];
      } else {
        child.keys[i] = partner.keys[i];
      }
    }

    return child;
  }

  mutate(mutationRate) {
    for (let i = 0; i < this.keys.length; i += 1) {

      if (Math.random() < mutationRate) {
        this.keys[i] = generateLetter();
      }
    }
  }
}

class Population {
  constructor(size, target, mutationRate) {
    size = size || 1;
    this.members = [];
    this.mutationRate = mutationRate;

    for (let i = 0; i < size; i += 1) {
      this.members.push(new Member(target));
    }
  }

  evolve(generations) {
    for (let i = 0; i < generations; i += 1) {
      const pool = this._selectMembersForMating();
      this._reproduce(pool);
    }
  }

  _selectMembersForMating() {
    const matingPool = [];

    this.members.forEach((m) => {
      
      const f = Math.floor(m.fitness() * 100) || 1;

      for (let i = 0; i < f; i += 1) {
        matingPool.push(m);
      }
    });

    return matingPool;
  }

  _reproduce(matingPool) {
    for (let i = 0; i < this.members.length; i += 1) {
    
      const parentA = matingPool[random(0, matingPool.length)];
      const parentB = matingPool[random(0, matingPool.length)];

      const child = parentA.crossover(parentB);

      child.mutate(this.mutationRate);

      this.members[i] = child;
    }
  }
}


function generate(populationSize, target, mutationRate, generations) {
 
  const population = new Population(populationSize, target, mutationRate);
  population.evolve(generations);

  const membersKeys = population.members.map((m) => m.keys.join(''));
  const perfectCandidatesNum = membersKeys.filter((w) => w === target);
  console.log(membersKeys);
  console.log(`${perfectCandidatesNum ? perfectCandidatesNum.length : 0} member(s) typed "${target}"`);
}

generate(30, 'ali', 0.05, 20);