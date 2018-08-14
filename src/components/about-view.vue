<template lang="pug">
div.about-content
  div.block.title-block
      div.about-title.green Om
  div.block.green-bg.padding-tb
    .block-content
      div.intro-block-title.white Oplog.se är en operationslogg för alla läkare!
  div.block.padding-tb
    .block-content
      .block-text-section
        span.block-section-title För alla
        span.block-section-body  Oplog.se kan användas av alla läkare oavsett specialitet. Eftersom man registrerar sina operationer med socialstyrelsens KVÅ-koder finns samtliga åtgärder eller operationer att välja mellan. Det är lika lätt att registrera att du utfört en förlossningsepidural som en buklaparotomi!
      img.block-img.block-img-right(src='../assets/surgeon.svg')
  div.block.padding-tb
    .block-content
      img.block-img.block-img-left(src='../assets/code.svg')
      .block-text-section
        span.block-section-title Av läkare
        span.block-section-body
          | Oplog.se är skapat och utvecklat av läkare.
          | Tjänsten drivs ideelt och kostar ingenting att använda.
          | Målsättningen är att det ska vara så enkelt som möjligt att hålla koll på sina operationer eller åtgärder.
          | Webklienten är öppen källkod och finns på GitHub. Se länk nedan.
          | Är du intresserad av att bidra och förbättra oplog.se, hör av dig!
        button.oplog-button.oplog-button-default(@click='email' style='width: 200px; margin-top: 10px;') Kontakta oss
  .footer
    .contact-links
      a.contact-img-container(href='https://www.facebook.com/oplog.se/' target='_blank')
        img.contact-img(src='../assets/facebook.svg')
      a.contact-img-container(href='mailto:oplog.dev@gmail.com')
        img.contact-img(src='../assets/envelope.svg')
      a.contact-img-container(href='https://github.com/cringblom/oplog-web-client' target='_blank')
        img.contact-img(src='../assets/github.svg')
</template>

<script>
export default {
  methods: {
    email: function() {
      document.location.href = "mailto:oplog.dev@gmail.com"
    }
  }
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
  flex: 0 1 auto;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
.block-content {
  display: flex;
  //flex: 1 0 auto;
  align-items: center;
  width: 1200px;
  @media all and (max-width: $oplog-width-breakpoint) {
    flex-direction: column;
  }
  &>*:first-child {
    margin-right: 50px;
  }
}
.block-text-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  .block-section-title {
    font-size: 2rem;
    margin-bottom: 5px;
    font-weight: 500;
  }
  .block-section-body {
    font-size: 1.2rem;
    font-weight: 400;
  }
}
.block-img {
  width: 250px;
  @media all and (max-width: $oplog-width-breakpoint) {
    display: none;
  }
}
.title-block {
  padding-top: 30px;
  padding-bottom: 30px;
  .about-title {
    font-size: 4rem;
    font-weight: 400;
  }
}
.intro-block-title {
  font-size: 1.5rem;
  font-weight: 400;
  text-align: center;
  width: 100%;
}
.footer {
  width: 100%;
  height: 80px;
  border-top: 1px solid gray;
}
.contact-links {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  & > * {
    margin-right: 10px;
  }
  & > *:last-child {
    margin-right: 0;
  }
}
.contact-img-container {
  $size: 50px;
  $border-color: #4A4A4A; //Must match img fill color
  width: $size;
  height: $size;
  border: solid 2px $border-color;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.contact-img {
  width: 60%;
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
