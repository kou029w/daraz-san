import type { Listener } from "../bot";
import apod from "./apod";
import dns from "./dns";
import faiz from "./faiz";
import goku from "./goku";
import ipinfo from "./ipinfo";
import json from "./json";
import morpheme from "./morpheme";
import nurupo from "./nurupo";
import nyanchu from "./nyanchu";
import random from "./random";
import tellme from "./tellme";
import unchiku from "./unchiku";
import weather from "./weather";
import yakitori from "./yakitori";

const listeners: Listener[] = [
  apod,
  dns,
  faiz,
  goku,
  ipinfo,
  json,
  morpheme,
  nurupo,
  nyanchu,
  random,
  tellme,
  unchiku,
  weather,
  yakitori,
].flat();

export default listeners;
