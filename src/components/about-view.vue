<template lang="pug">
div.about-content
  div.block.title-block
      div.about-title.green Om oplog.se
  div.block.intro-block.green-bg
    .block-content
      //div.intro-block-title.white oplog.se är en operationslogg för alla opererande läkare
      div.intro-block-title.white En operationslogg i molnet. Just nu i beta. Mer info kommer inom kort.
  //div.block.padding-tb
    .block-content
      div.block-section
        div.block-title För alla operatörer
        div.block-text oplog.se lämpar sig för alla opererande läkare. Varje ingrep registreras med en ICD-kod och samtliga av Socialstyrelsens KVÅ-koder finns att välja mellan. Detta gör att du kan använda oplog.se oavsett om du är kirurg, ortoped, eller annan opererande läkare.
      div.block-section
        div.block-text Vanliga metoder som att skapa exceldokument, skriva ut op-berätterlser eller rtg-bilder är svåra att underhålla och ger en relativt dålig överblick. Med oplog.se ser du snabbt hur många operationer du utfört av varje typ och hur länge sedan du gjorde de senast.
  //div.block.padding-tb
    div.block-text oplog.se utvecklas och drivs ideelt och kostar därför ingenting att använda.
</template>

<script>
export default {

}
</script>

<style scoped lang="scss">
@import '../style-variables';
.about-content {
  display: flex;
  flex-direction: column;
}
.block {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
.block-content {
  display: flex;
  width: $oplog-width-breakpoint;
  @media all and (max-width: $oplog-width-breakpoint) {
    flex-direction: column;
  }
}
.block-section {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.title-block {
  padding-top: 30px;
  padding-bottom: 30px;
  .about-title {
    margin: auto;
    font-size: 4rem;
    font-weight: 300;
  }
}
.block-title {
  text-align: center;
  font-size: 1.7rem;
  color: rgb(93, 93, 93);
  margin-bottom: 20px;
  font-weight: 500;
}
.block-text {
  font-size: 1.3rem;
  color: rgb(93, 93, 93);
  font-weight: 400;
}
.intro-block {
  background: rgb(237, 237, 237);
  .intro-block-title {
    font-size: 1.5rem;
    font-weight: 400;
    margin-top: 40px;
    margin-bottom: 40px;
    text-align: center;
  }
  .intro-block-text {
    font-size: 1.5rem;
  }
}
.green-bg {
  background: $oplog-green;
}
.yellow-bg {
  background: $oplog-yellow;
}
.white {
  color: white
}
.green {
  color: $oplog-green;
}
.padding-tb {
  padding-top: 80px;
  padding-bottom: 80px;
}
</style>
